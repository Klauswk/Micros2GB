void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  Serial.print("Ligou\987");
  digitalWrite(LED_BUILTIN, HIGH);
  delay(5000);
  Serial.print("Desligou\987");
  digitalWrite(LED_BUILTIN, LOW);
  delay(5000);          
}
