package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {}

// 사용자id, 일시, 접종장소, 백신 종류, 차수
type VaccinationCertificate struct {
   UserId string `json:"userid"`
   Date string `json:"date"`
   VaccineType string `json:"vaccinetype"`
   VaccineNumber string `json:"vaccinenumber"`
}
type CertificateKey struct {
   Key string
   Idx int
}

var latestKey string = "latestKey"

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) pb.Response {
   return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) pb.Response {

   fmt.Println()
   function, args := APIstub.GetFunctionAndParameters()

   if function == "putCertificate" { // 특정인의 백신 이력 등록
      return s.putCertificate(APIstub, args)
   } else if function == "getCertificateByCertKey" { // 특정 백신 이력 조회
      return s.getCertificateByCertKey(APIstub, args)
   } else if function == "getCertificateByUserId" { // 특정인의 백신 이력들 조회
      return s.getCertificateByUserId(APIstub, args)
   } else if function == "getAllCertificate" { // 모든 사람의 백신 이력들 조회
      return s.getAllCertificate(APIstub)
   } else if function == "getCertificatesByCertKeys"{ // 특정 백신 이력들 조회
      return s.getCertificatesByCertKeys(APIstub, args)
   } else if function == "deleteVaccinationCertificate"{ // 접종 내역 삭제
      return s.deleteVaccinationCertificate(APIstub, args)
   }
   fmt.Println("Please check your function : " + function)
   return shim.Error("Unknown function")
}

// 새 CertificateKey 생성
func generateKey(APIstub shim.ChaincodeStubInterface, key string) []byte {

   lastCertificateKeyJSON, err := APIstub.GetState(key)
   fmt.Println("latestKey: ("+key+", "+string(lastCertificateKeyJSON)+")")
   if err != nil {
      fmt.Println(err.Error())
   }

   certificateKey := CertificateKey{}
   json.Unmarshal(lastCertificateKeyJSON, &certificateKey)

   // 저장된것이 없으면 초기값 설정
   if len(certificateKey.Key) == 0 || certificateKey.Key == "" {
      certificateKey.Key = "VC"
      certificateKey.Idx = 0 // 초기값, VC0에는 아무런 값도 저장하지 않는다.
   }
   // 기존값(초기값) + 1
   certificateKey.Idx = certificateKey.Idx+1

   newCertificateKeyJSON, _ := json.Marshal(certificateKey)
   fmt.Println("created key: " + string(newCertificateKeyJSON))

   return newCertificateKeyJSON
}

// 특정인의 백신 이력 등록
func (s *SmartContract) putCertificate(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

   if len(args) != 4 {
      return shim.Error("Incorrect number of arguments. Expecting 4")
   }

   var certificateKey = CertificateKey{} // 새로 저장할 키
   json.Unmarshal(generateKey(APIstub, latestKey), &certificateKey)

   var certificate = VaccinationCertificate{UserId: args[0], Date: args[1], VaccineType: args[2], VaccineNumber: args[3]}
   certificateJSON, _ := json.Marshal(certificate)

   var keyString = certificateKey.Key + strconv.Itoa(certificateKey.Idx)

   err := APIstub.PutState(keyString, certificateJSON) // ("VC01", {.접종 이력.}) 저장
   fmt.Println("save ("+keyString+", "+string(certificateJSON)+")")
   if err != nil {
      return shim.Error(fmt.Sprintf("Failed to record cert catch: %s", certificateKey))
   }

   certificateKeyJSON, _ := json.Marshal(certificateKey)

   err = APIstub.PutState(latestKey, certificateKeyJSON) // (latestKey, {.새로 저장된 백신 key.}) 갱신
   fmt.Println("save (latestKey, "+string(certificateKeyJSON)+")")
   if err != nil {
      return shim.Error(fmt.Sprintf("Failed to record latestKey catch: %s", certificateKey))
   }

   return shim.Success(nil)
}

// 특정 백신 이력 조회
func (s *SmartContract) getCertificateByCertKey(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

   certificateJSON, err := APIstub.GetState(args[0]) // 백신인덱스(백신키)에 저장된 정보
   fmt.Println("info: ("+args[0]+", "+string(certificateJSON)+")")
   if err != nil {
      fmt.Println(err.Error())
   }

   var buffer bytes.Buffer
   buffer.WriteString("[")
   bArrayMemberAlreadyWritten := false

   if bArrayMemberAlreadyWritten == true {
      buffer.WriteString(",")
   }

   buffer.WriteString("{\"vaccineKey\":")
   buffer.WriteString("\"")
   buffer.WriteString(args[0])
   buffer.WriteString("\"")

   buffer.WriteString(", \"record\":")
   buffer.WriteString(string(certificateJSON))
   if(string(certificateJSON)==""){
      buffer.WriteString("\"\"")
   }
   buffer.WriteString("}")

   bArrayMemberAlreadyWritten = true
   buffer.WriteString("]")

   return shim.Success(buffer.Bytes())

}

// 특정인의 백신 이력들 조회
func (s *SmartContract) getCertificateByUserId(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

   var userId = args[0]
   certificateKeyJSON, _ := APIstub.GetState(latestKey) // Find latestKey

   certificateKey := CertificateKey{}
   json.Unmarshal(certificateKeyJSON, &certificateKey)

   var startKey = "VC1"
   var endKey = certificateKey.Key + strconv.Itoa(certificateKey.Idx + 1)
   fmt.Println("search range: ("+startKey+")~("+endKey+"-1)")

   resultsIter, err := APIstub.GetStateByRange(startKey, endKey)
   if err != nil {
      return shim.Error(err.Error())
   }
   defer resultsIter.Close()

   var buffer bytes.Buffer
   buffer.WriteString("[")
   bArrayMemberAlreadyWritten := false
   for resultsIter.HasNext() {
      queryResponse, err := resultsIter.Next()
      if err != nil {
         return shim.Error(err.Error())
      }

      var tempCertificate VaccinationCertificate
      json.Unmarshal(queryResponse.Value, &tempCertificate)

      if (tempCertificate.UserId != userId){ // 사용자의 접종 이력이 아니면
         continue
      }

      if bArrayMemberAlreadyWritten == true {
         buffer.WriteString(", ")
      }
      buffer.WriteString("{\"vaccineKey\":")
      buffer.WriteString("\"")
      buffer.WriteString(queryResponse.Key)
      buffer.WriteString("\"")

      buffer.WriteString(", \"record\":")
      buffer.WriteString(string(queryResponse.Value))
      if(string(queryResponse.Value)==""){
         buffer.WriteString("\"\"")
      }
      buffer.WriteString("}")
      bArrayMemberAlreadyWritten = true
   }
   buffer.WriteString("]")
   return shim.Success(buffer.Bytes())
}

// 모든 사람의 백신 이력들 조회
func (s *SmartContract) getAllCertificate(APIstub shim.ChaincodeStubInterface) pb.Response {

   certificateKeyJSON, _ := APIstub.GetState(latestKey) // Find latestKey

   certificateKey := CertificateKey{}
   json.Unmarshal(certificateKeyJSON, &certificateKey)

   var startKey = "VC1"
   var endKey = certificateKey.Key + strconv.Itoa(certificateKey.Idx + 1)
   fmt.Println("search range: ("+startKey+")~("+endKey+"-1)")

   resultsIter, err := APIstub.GetStateByRange(startKey, endKey)
   if err != nil {
      return shim.Error(err.Error())
   }
   defer resultsIter.Close()

   var buffer bytes.Buffer
   buffer.WriteString("[")
   bArrayMemberAlreadyWritten := false
   for resultsIter.HasNext() {
      queryResponse, err := resultsIter.Next()
      if err != nil {
         return shim.Error(err.Error())
      }

      if bArrayMemberAlreadyWritten == true {
         buffer.WriteString(", ")
      }
      buffer.WriteString("{\"vaccineKey\":")
      buffer.WriteString("\"")
      buffer.WriteString(queryResponse.Key)
      buffer.WriteString("\"")

      buffer.WriteString(", \"record\":")
      buffer.WriteString(string(queryResponse.Value))
      if(string(queryResponse.Value)==""){
         buffer.WriteString("\"\"")
      }
      buffer.WriteString("}")
      bArrayMemberAlreadyWritten = true
   }
   buffer.WriteString("]")
   return shim.Success(buffer.Bytes())
}

// 특정 백신 이력들 조회
func (s *SmartContract) getCertificatesByCertKeys(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

   if len(args) < 2 {
      return shim.Error("Incorrect number of arguments. Expecting 2 or more")
   }

   var buffer bytes.Buffer
   buffer.WriteString("[")

   for index, value := range args {
      certificateJSON, err := APIstub.GetState(value) // 백신인덱스(백신키)에 저장된 정보
      fmt.Println("info: ("+value+", "+string(certificateJSON)+")")
      if err != nil {
         fmt.Println(err.Error())
      }

      if index != 0 {
         buffer.WriteString(",")
      }

      buffer.WriteString("{\"vaccineKey\":")
      buffer.WriteString("\"")
      buffer.WriteString(value)
      buffer.WriteString("\"")

      buffer.WriteString(", \"record\":")
      buffer.WriteString(string(certificateJSON))
      if(string(certificateJSON)==""){
         buffer.WriteString("\"\"")
      }
      buffer.WriteString("}")

   }

   buffer.WriteString("]")
   return shim.Success(buffer.Bytes())
}

// 접종 내역 삭제
func (s *SmartContract) deleteVaccinationCertificate(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {
   if len(args) != 1 {
       return shim.Error("Incorrect number of arguments. Expecting 1")
   }
   if(args[0] == latestKey){
      return shim.Error("latestKey cannot be deleted.")
   }

   certificateKey := args[0]

   // Delete the key from the state in ledger
   err := APIstub.DelState(certificateKey)
   if err != nil {
       return shim.Error("Failed to delete state")
   }

   return shim.Success(nil)
}

func main() {
   fmt.Println("START CHAINCODE")

   err := shim.Start(new(SmartContract))
   if err != nil {
      fmt.Printf("Error starting Simple chaincode: %s", err)
   }
}
