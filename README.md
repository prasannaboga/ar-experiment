# AR Experiment

## Start server

```bash
python3 -m http.server
```

## Chrome

Chrome needs https to allow camera. Serve your trafic trough `ngrok`.

```bash
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
./ngrok http 8000
```

## Resources

Libraries:
* [tree.js](https://github.com/mrdoob/three.js)
* [jsartoolkit5](https://github.com/artoolkit/jsartoolkit5)
* [aframe](https://github.com/aframevr/aframe)

Repositories:
* [AR.js](https://github.com/jeromeetienne/AR.js)

Tools:
* [ngrok](https://ngrok.com/)
