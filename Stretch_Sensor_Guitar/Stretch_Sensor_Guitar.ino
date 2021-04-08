const int stringCount = 3; 
const int stretchInputs[stringCount] = {A0,A1,A2};
const int potInputs[stringCount] = {A5,A6,A7};

const String stringNames[stringCount] = {"0","1","2"};
const int defaultPos[stringCount] = {675,666,690};

const int stableInterval = 50; //# of frames averaged
const int timeInterval = 40; //# of frames tracked for pluck
const int playSize = 15;

static int rawInputs[stringCount][stableInterval];
static int stableVals[stringCount][timeInterval];
static int potVals[stringCount];

static int rawCounter = 0;
static int stableCounter = 0;

static int currentVals[stringCount];
static int pastVals[stringCount];
static int maxVals[stringCount];

static bool stringStatus[stringCount] = {false};

void setup() {
  // put your setup code here, to run once:
  for (int s = 0; s < stringCount; s++) {
    pinMode(stretchInputs[s],INPUT);
    pinMode(potVals[s],INPUT);
  }
  Serial.begin(9600);
}

void loop() {
  recordRawInputs();
  recordStableValues();
  for (int s = 0; s < stringCount; s++) {
//    Serial.println(potVals[s]);
  }
//  Serial.println(currentVals[0]);
//  Serial.print("\t");
//  Serial.println(pastVals[0]);
  for (int s = 0; s < stringCount; s++) {
//    Serial.print(currentVals[s]);
//    Serial.print("\t");
    //if string is plucked (sufficient value drop over specified interval)
    if (currentVals[s]-pastVals[s] > playSize && currentVals[s] < defaultPos[s]-playSize && !stringStatus[s]) {
      stringStatus[s] = true;
      Serial.print(s);
      Serial.print(",");
      Serial.print(getMin(stableVals[s],timeInterval));
      Serial.print(",");
      Serial.print(potVals[s]);
      Serial.println(".");
    } //prevent further plucks until string returns to previous position
    if (stringStatus[s] && currentVals[s]-pastVals[s] == 0) {
      stringStatus[s] = false;
    }
  }
//  Serial.println();
}

void recordRawInputs() {
  for (int s = 0; s < stringCount; s++) { //for each string
    int value = analogRead(stretchInputs[s]); //get its current value
    rawInputs[s][rawCounter] = value; //put it in an array
//    Serial.print(value);
//    Serial.print("\t");
  }
//  Serial.println();
  if (rawCounter == stableInterval) { //increment or reset counter
    rawCounter = 0;
  } else {
    rawCounter++;
  }
}

void recordStableValues() {
  for (int s = 0; s < stringCount; s++) {
    potVals[s] = analogRead(potInputs[s]);
    int value = avg(rawInputs[s],stableInterval);
    if (value < defaultPos[s]+5) {
      stableVals[s][stableCounter] = value;
      currentVals[s] = value; //update current values
    }
    
    int pastIndex = pastCounter(stableCounter,30,timeInterval);
    pastVals[s] = stableVals[s][pastIndex];

//  Serial.print(value);
//  Serial.print("\t");
  }
//  Serial.println();
  if (stableCounter == timeInterval) {
    stableCounter = 0;
  } else {
    stableCounter++;
  }
}

int avg(int arr[], int arrLength) {
  int totalVal = 0;
  for (int i = 0; i < arrLength; i++) {
    totalVal+=arr[i];
  }
  return totalVal/arrLength;
}

int pastCounter(int index, int pastFrames, int arrLength) {
  int pastIndex = index - pastFrames;
  if (pastIndex < 0) {
    pastIndex+= arrLength;
  }
  return pastIndex;
}

int getMin(int arr[], int arrLength) {
  int minVal = 2000;
  for (int i = 0; i < arrLength; i++) {
    if (arr[i] < minVal) {
      minVal = arr[i];
    }
  }
  return minVal;
}
