onload = function(){
    const editor = document.getElementById("editor");
    const context = editor.getContext("2d");
    const toolbar = document.getElementById("toolbar");
    
    const tools = {
        "upload" : function(){
            const upload = document.createElement("input");
            upload.type = "file";
            upload.click();
            upload.onchange = function(){
                const img = new Image();
                img.onload = () => {
                    editor.width = img.width;
                    editor.height = img.height;
                    context.drawImage(img,0,0);
                };
                img.onerror = () => {
                    console.log("Image not Loaded");
                };
                
                img.src = URL.createObjectURL(this.files[0]);
            };
        },
        
        "save" : function(){
            const image = editor.toDataURL();
            const link = document.createElement('a');
            link.download = 'image.png';
            link.href = image;
            link.click();
        },
        
        "flipHor" : function(){
            let cols = editor.width;
            let rows = editor.height;
            let image = getRGBArray(rows,cols);
            
            for(let i=0;i<Math.floor(rows/2);i++){
                for(let j=0;j<cols;j++){
                    let temp = image[i][j];
                    image[i][j] = image[rows-1-i][j];
                    image[rows-1-i][j] = temp;
                }
            }
            setImageData(image,rows,cols);
        },
        
        "flipVert" : function(){
            let cols = editor.width;
            let rows = editor.height;
            let image = getRGBArray(rows,cols);
            
            for(let i=0;i<rows;i++){
                for(let j=0;j<Math.floor(cols/2);j++){
                    let temp = image[i][j];
                    image[i][j] = image[i][cols-1-j];
                    image[i][cols-1-j] = temp;
                }
            }
            setImageData(image,rows,cols);
        },
        
        "rotateL" : function(){
            let cols = editor.width;
            let rows = editor.height;
            let image = getRGBArray(rows,cols);
            
            let limage = [];
            for(let i=cols-1;i>=0;i--){
                let row = [];
                for(j=0;j<rows;j++){
                    row.push(image[j][i]);
                }
                limage.push(row);
            }
            setImageData(limage,cols,rows);
        },
        
        "rotateR" : function(){
            let cols = editor.width;
            let rows = editor.height;
            let image = getRGBArray(rows,cols);
            
            let rimage = [];
            for(let i=0;i<cols;i++){
                let row = [];
                for(j=rows-1;j>=0;j--){
                    row.push(image[j][i]);
                }
                rimage.push(row);
            }
            setImageData(rimage,cols,rows);
        },
        
        "resize" : function(){
            let cols = editor.width;
            let rows = editor.height;
            let image = getRGBArray(rows,cols);
            
            let inp = prompt("Current Width : " + cols + '\n' + 'Current Height : ' + rows + '\n' + 
                             "Give New Height and Width in space separated Manner").split(' ');
            if(inp.length!==2){
                alert("Incorrect Dimensions");
                return;
            }
            
            let ncols = parseInt(inp[0]);
            let nrows = parseInt(inp[1]);
            
            if(isNaN(nrows) || isNaN(ncols)){
                alert("Input is Invalid");
                return;
            }
            
            let hratio = rows/nrows;
            let wratio = cols/ncols;
            
            let nimage = [];
            for(let i=0;i<nrows;i++){
                let row = [];
                for(let j=0;j<ncols;j++){
                    row.push(image[Math.floor(i*hratio)][Math.floor(j*wratio)]);
                }
                nimage.push(row);
            }
            setImageData(nimage,nrows,ncols);
        },
        
        "greyscale" : function(){
            let cols = editor.width;
            let rows = editor.height;
            let image = getRGBArray(rows,cols);
            
            for(let i=0;i<rows;i++){
                for(let j=0;j<cols;j++){
                    let pixel = image[i][j];
                    let shade = Math.floor(0.3*pixel[0] + 0.59*pixel[1] + 0.11*pixel[2]);
                    image[i][j][0] = image[i][j][1] = image[i][j][2] = shade;
                }
            }
            setImageData(image,rows,cols);
        }
    };
    
    for(let button of toolbar.children){        // Traversing every button and Saving its ID and triggering function on Click..!!
        if(button.nodeName==="BUTTON"){ 
            button.onclick = function(event){
                event.preventDefault();
                tools[this.id].call(this);
            }
        }
    }
    
    function setImageData(data,rows,cols){              // Convert 3D Array to 1D Array as convas stores data in 1D Array
        const Image = Array.from({length: rows*cols*4});  // Declaring 1D array
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                for(let k=0;k<4;k++){
                    Image[(i*cols + j)*4 + k] = data[i][j][k]; // Stores 3D image in 1D array
                }
            }
        }
        
        const idata = context.createImageData(cols,rows); // Create a blank Image with width = cols, height = rows
        idata.data.set(Image); // Set data of idata with data in Image Array
        editor.width = cols;   //Resizing the Editor according to Image Dimensions
        editor.height = rows;
        context.putImageData(idata,0,0); // Loading Image from (0,0)
    }
    
    function getRGBArray(rows,cols){                            // Convert 1D Array to 3D Array for Image Processing
        let data = context.getImageData(0,0,cols,rows).data;
        const RGBImage = [];
        for(let i=0;i<rows;i++){
            let row = [];
            for(let j=0;j<cols;j++){
                let pixel = [];
                for(let k=0;k<4;k++){
                    pixel.push(data[(i*cols + j)*4 + k]); // Pushing 4 Values of a Pixel
                }
                row.push(pixel);
            }
            RGBImage.push(row);
        }
        return RGBImage;
    }
};