import * as vscode from 'vscode';
import * as path from 'path';

export default class ImagePreviewWebview {

  constructor(private context: vscode.ExtensionContext) { }

  static isArray(value: any) {
    return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number'
      && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
  }

  static flatDeep(arr1: any[]): any[] {
    if (!this.isArray(arr1)) {
      arr1 = [arr1];
    }
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(this.flatDeep(val)) : acc.concat(val), []);
  };

  public async findImages(data: string, doNotCheckBase64: boolean = false): Promise<String[]> {
    console.log("detect images in data with method" + doNotCheckBase64 ? "flat and start" : "regexp")
    let imageList: String[] = [];
    if (doNotCheckBase64) {
      //fast method. parse the json, look for strings starting with data:image/png;base64,
      let objlist = ImagePreviewWebview.flatDeep(JSON.parse(data));
      imageList = objlist.filter(v => {
        return ((typeof (v) === 'string') && (String(v).startsWith("data:image/png;base64,")));
      })
    } else {
      //slow method. carefully look for images with a regexp
      let imgb64Pattern: string = '"(data:image\/png;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)"';
      let re = RegExp(imgb64Pattern, 'g');
      let match: RegExpMatchArray | null;
      imageList = [];
      while ((match = re.exec(data))) {
        imageList.push(match[1]);
      }
    }
    console.log("found " + imageList.length + " images")
    //imageList.forEach ( (v:String) => {console.log(v.substr(0,30) + "..." +v.substring(v.length-20,v.length));});
    return (imageList);
  }

  public async getHtmlContent(imageList: String[]): Promise<string> {

    //build the spectre css path, the webview way.
    let fileSaveronDiskPath = vscode.Uri.file(path.join(this.context.extensionPath, 'node_modules', 'file-saver', 'dist', 'FileSaver.min.js'));
    let fileSaverPath: string = fileSaveronDiskPath.with({ scheme: 'vscode-resource' }).toString();

    let htmlContent = `<head>
        
        <title>Stack images</title>
        <script src="${fileSaverPath}"></script>
        <style media="screen" type="text/css">

        img {
            border-style: dashed;
            border-color: red;
            border-width: 1.1px;
            background-color: #fff;
            background-image: linear-gradient(45deg,#efefef 25%,transparent 25%,transparent 75%,#efefef 75%,#efefef),linear-gradient(45deg,#efefef 25%,transparent 25%,transparent 75%,#efefef 75%,#efefef);
            background-position: 0 0,10px 10px;
            background-size: 21px 21px;        
        }
        
        .imgsavebutton { margin : 3px; }
        </style>
        </head>
        <body> Warp10 base64 images output, TOP to BOTTOM of stack`
    let imgcounter = 1
    imageList.forEach((image: String) => {
      htmlContent += `<h2>Image ${imgcounter} </h2>`
      htmlContent += `<img src="${image}" /><br/>`
      htmlContent += `<input type="button" class="imgsavebutton" value="Save Image ${imgcounter}..." onClick="saveimg('${image}')"/>`
      //link test 1
      imgcounter++;
    })
    htmlContent += `<br/>
    <script>
    
      //thanks to https://stackoverflow.com/questions/46405773/saving-base64-image-with-filesaver-js
      function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        // create a view into the buffer
        var ia = new Uint8Array(ab);
        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;
      }

      function saveimg(base64image) {
        b=dataURItoBlob(base64image);
        d=new Date();
        saveAs(b,"Warp 10-Processing Image-" + d.toISOString() + ".png")
      }
    
    </script>
    
    </br>stack bottom</body>`

    return htmlContent;
  }

}