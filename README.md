# NudeNuke

<br>


<p align="center">
<img width=250px src="https://github.com/ixiLod/NudeNuke/assets/51421090/661e1fcd-4ee9-4e9e-9a9e-817397eba22e">
</p>

<br>

<p align="center">
  it is a slick and intuitive application which is intended for the creator of live content, such as streamers
</p>

<p align="center">
  <img src="static/assets/tutogifanim.gif" alt="tutoGif">
</p>
<p align="center">*<em>For the purposes of the demo here, the manual filter is used, the auto filter only detects naked or explicit content</em>*
</p>


<br>

## How to use

Apply the window to the content you want to monitor, adjust to the right size so that the initial tutorial disappears and the detection system targets the right content, then choose the options available to you below.

This application use keyboard, there are 4 options keys :
- **Escape** : *to quit app.*
- **X** : *to lock/delock the window in front of.*
- **B** : *to activate/desactivate filter manually.*
- **Space** : *to activate/desactivate automatic filter.*

<br>

## How it work

1-Screenshot-desktop take a full screenshot to your primary screen.<br>
2-Sharp resize this for fit with the size and position window.<br>
3-Tensorflow initialize and receive the images.<br>
4-NSFW model predict nsfw score.<br>
5-If nsfw score too height, activate filter.<br>

*No images are stored on your system, they are stored in RAM and deleted each time the script repeats its action, that is every 0.5 seconds*

<br>

## Installation

**MacOS** : Just download the latest release => [NudeNuke.app](https://github.com/ixiLod/NudeNuke/releases/download/v0.1.3/NudeNuke-darwin-arm64-0.1.3.zip), unzip, and put the app in your applications folder, <br>then allow the app to Privacy & Security => Screen Recording.<br>
( You need to desactivate GateKeeper for use at this time, because this application is not licensed )
<br><br>

**Windows** : Just download the latest release =>[NudeNuke.exe](https://github.com/ixiLod/NudeNuke/releases/download/v0.1.3/NudeNuke-0.1.3.Setup.exe), launch the .exe for install, then your app is ready to use.
<br><br>

**Linux** : Just dowmload source code, then open in your editor, run `npm install`, then `npm start`, you can use the application juste like that, also you can completely build the app with `npm run make`.  
<br><br>

## Dependencies

[screenshot-desktop](https://github.com/bencevans/screenshot-desktop) : Capture a screenshot of your local machine.<br>

[sharp](https://sharp.pixelplumbing.com/) : Fastest resizer images library.<br>

[NSFWJS](https://github.com/infinitered/nsfwjs) : A simple JavaScript library to help you quickly identify unseemly images.<br>

[Tensorflow.js](https://www.tensorflow.org/js) : Machine learning library for Javascript.<br>
<br>

## Support
<img src="https://github.com/ixiLod/NudeNuke/assets/51421090/2273f1d9-7346-47b7-8aa2-2197db33488d" width="128">

You can support me by buying me a coffee => [here](https://www.buymeacoffee.com/vrh9ft859hx) <=
 Thank you for the support!
