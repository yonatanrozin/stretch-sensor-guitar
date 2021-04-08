# Stretch Sensor Guitar
A guitar prototype that uses stretch sensors as strings and communicates with a sequencer in p5.js. A video demonstration can be found [here](https://youtu.be/n1DFHVW942c)! Additional documentation and demonstration videos can be found [here](https://wp.nyu.edu/yonatanrozin/pcomp-project-2/), though a new, more organized documentation is currently in progress.

## Introduction
Stretch Sensor Guitar was created as the second assignment for my Physical Computing course (guidelines can be found [here](https://itp.nyu.edu/physcomp/itp/syllabus/assignments/#Project_2). The project uses a wired Arduino-to-PC connection through asynchronous serial communication, which very much resembles and performs many of the same functions as connecting an electric guitar to an amp. The PC runs a p5.js sketch, which synthesizes the guitar notes in real time and provides a sequencer to record pitch/volume information and play it back.

I had been very eager to mess around with some [stretch sensors](https://www.adafruit.com/product/519) I read about online. These sensors consist of nothing more than a length of conductive rubber cord, whose electrical resistance is a function of the ratio between its current (stretched) and original (unstretched) length. To measure the degree of stretch on a length of the cord, a current is sent through it and measured at the other end. As the cord is stretched, its conductive particles get spread out, increasing the resistance and decreasing the voltage in the other end.

This project attempts to replicate the function of a real guitar as closely as possible. It will produce a sound whenever one of the strings is plucked or strummed at a volume proportional to the degree of stretch on the cord. In other words: the stronger the pluck, the louder the sound, much like on a real guitar. The pitch of each of its 3 strings must be tuned with a corresponding potentiometer, making playing melodies in real time almost impossible. To make up for this, the p5.js sketch provides a sequencer, where the notes can be recorded at a certain position in time and then played back to form a melody.

To sense the "plucking" of one of the stretch sensor strings, the Arduino is constantly tracking their resistance over time. If the arduino detects a sufficient decrease in resistance over a sufficiently short duration, it sends 3 numbers to p5.js, which correspond to which string was plucked, the degree to which it was plucked and the value on that string's corresponding potentiometer. If the user has clicked on one of the spaces on the sequencer, the pitch and volume of a played note are stored in that space. Once the user has recorded their desired notes, they can hit the spacebar to hear the notes played in sequence.

## Materials

### Hardware

- An [Arduino Nano 33 IoT](https://store.arduino.cc/usa/nano-33-iot) 
- A length of [rubber cord stretch sensors](https://www.adafruit.com/product/519)
- 3 potentiometers

### Software

For developers:
- The [Arduino IDE](https://www.arduino.cc/en/software)

For users and developers:
- The [p5.js Web Editor](https://editor.p5js.org/) with the [Space-Mapper Car p5.js sketch](https://editor.p5js.org/yr2053/sketches/QrwdervH3) loaded
- The [p5.SerialControl app](https://github.com/p5-serial/p5.serialcontrol/releases): this allows the p5.js Web Editor to receive and send serial data


## Installation Instructions

### Schematic Diagram

![A schematic diagram of an Arduino Nano 33 IoT wired to 3 potentiometers, 3 variable resistors and a pushbutton](https://github.com/yonatanrozin/stretch-sensor-guitar/blob/main/Images/Guitar%20Schematic.jpeg)


- Connect Arduino to PC using USB cable
- Open p5.serialcontrol app, make sure Arduino USB port is visible in the Available Ports list
- Upload [Arduino Code](https://github.com/yonatanrozin/stretch-sensor-guitar/blob/main/Stretch_Sensor_Guitar/Stretch_Sensor_Guitar.ino) to Arduino Board, making sure the USB port is selected in Tools/Port
- Open and run [p5.js sketch](https://editor.p5js.org/yr2053/sketches/QrwdervH3)
- Restart p5.serialcontrol app when necessary

## Credits

- A huge thanks to [David Rios](https://riosriosrios.com/) for bestowing upon me and my other classmates the knowledge and inspiration necessary to make this project happen!
