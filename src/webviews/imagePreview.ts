
export default class ImagePreviewWebview {

  private imgb64Pattern: string = '"(data:image\/png;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)"';


  public async imagesFound(data: string): Promise<boolean> {
    let re = RegExp(this.imgb64Pattern)
    return (data.match(re).length > 0)
  }

  public async getHtmlContent(data: string): Promise<string> {
    //regexp for base 64 image surrounded by double quotes
    let match: RegExpMatchArray | null;
    let imgcounter = 1

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
    let re = RegExp(this.imgb64Pattern, 'g')
    while ((match = re.exec(data))) {
      htmlContent += `<h2>Image ${imgcounter} </h2>`
      htmlContent += `<img src="${match[1]}" /><br/>`
      //link test 1
      imgcounter++;

    }
    htmlContent += '<br/></br>stack bottom</body>'

    return htmlContent
  }

}