# stretch-sensor-guitar
A guitar prototype that uses stretch sensors as strings and communicates with a sequencer in p5.js. A video demonstration can be found [here](https://youtu.be/n1DFHVW942c)!

##Introduction
Stretch Sensor Guitar was created as the second assignment for my Physical Computing course (guidelines can be found [here](https://itp.nyu.edu/physcomp/itp/syllabus/assignments/#Project_2). The project uses a wired Arduino-to-PC connection through asynchronous serial communication, which very much resembles and performs many of the same functions as connecting an electric guitar to an amp. The PC runs a p5.js sketch, which synthesizes the guitar notes in real time and provides a sequencer to record pitch/volume information and play it back.

I had been very eager to mess around with some [stretch sensors](https://www.adafruit.com/product/519) I read about online. These sensors consist of nothing more than a length of conductive rubber cord, whose electrical resistance is a function of the ratio between its current (stretched) and original (unstretched) length. To measure the degree of stretch on a length of the cord, a current is sent through it and measured at the other end. As the cord is stretched, its conductive particles get spread out, increasing the resistance and decreasing the voltage in the other end.

This project attempts to replicate the function of a real guitar as closely as possible. It will produce a sound whenever one of the strings is plucked or strummed at a volume proportional to the degree of stretch on the cord. In other words: the stronger the pluck, the louder the sound, much like on a real guitar. The pitch of each of its 3 strings must be tuned with a corresponding potentiometer, making playing melodies in real time almost impossible. To make up for this, the p5.js sketch provides a sequencer, where the notes can be recorded at a certain position in time and then played back to form a melody.

To sense the "plucking" of one of the stretch sensor strings, the Arduino is constantly tracking their resistance over time. If the arduino detects a sufficient decrease in resistance over a sufficiently short duration, it sends 3 numbers to p5.js, which correspond to which string was plucked, the degree to which it was plucked and the value on that string's corresponding potentiometer. If the user has clicked on one of the spaces on the sequencer, the pitch and volume of a played note are stored in that space. Once the user has recorded their desired notes, they can hit the spacebar to hear the notes played in sequence.
