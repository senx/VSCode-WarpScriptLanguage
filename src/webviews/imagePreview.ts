
export default class ImagePreviewWebview {



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

    let htmlContent = `<head>
        
        <title>Stack images</title>
        <style media="screen" type="text/css">

        img {
            border-style: dashed;
            border-color: red;
            border-width: 1px;
            background-color: #fff;
            background-image: linear-gradient(45deg,#efefef 25%,transparent 25%,transparent 75%,#efefef 75%,#efefef),linear-gradient(45deg,#efefef 25%,transparent 25%,transparent 75%,#efefef 75%,#efefef);
            background-position: 0 0,10px 10px;
            background-size: 21px 21px;        
        }
        
        </style>
        </head>
        <body> Warp10 base64 images output, TOP to BOTTOM of stack`
    let imgcounter = 1
    imageList.forEach((image: String) => {
      htmlContent += `<h2>Image ${imgcounter} </h2>`
      htmlContent += `<img src="${image}" /><br/>`
      //link test 1
      imgcounter++;
    })
    htmlContent += '<br/></br>stack bottom</body>'

    return htmlContent;
  }

}