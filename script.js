myCanvas.width=800;
myCanvas.height=300;

const n=23;
const array=[];

const stringHeight=myCanvas.height*0.40;

const socks=[];
const margin=30;
const availableWidth=myCanvas.width-margin*2;
const spacing=availableWidth/n;

const colors = ['#D35400', '#2471A3', '#F39C12',
				'#B2BABB', '#138D75', '#52BE80',
				'#BB8FCE', '#555555', '#bcf60c',
				'#fabebe', '#9a6324', '#54A1D3',
				'#aaffc3', '#808000', '#333333'];

const sockColors=[];

const tweenLength=30;

for(let i=0;i<n/2;i++){
    const t=i/(n/2-1);
    sockColors.push(colors[i]);
    sockColors.push(colors[i]);
    array.push(lerp(0.3,1,t));
    array.push(lerp(0.3,1,t));
}

for(let i=0;i<array.length;i++){
    const j=Math.floor(Math.random()*array.length);
    [array[i],array[j]]=[array[j],array[i]];
    [sockColors[i],sockColors[j]]=[sockColors[j],sockColors[i]];
}

for(let i=0;i<array.length;i++){
    const u=Math.sin(i/(array.length-1)*Math.PI);
    const x=i*spacing+spacing/2+margin;
    const y=stringHeight+u*margin*0.7;
    const height=myCanvas.height*0.4*array[i];
    socks[i]=new Sock(x,y,height,sockColors[i]);
}

const bird=new Bird(socks[0].loc,socks[1].loc,myCanvas.height*0.20);

const moves=insertionSort(array);
moves.shift();

const ctx=myCanvas.getContext("2d");
const startTime=new Date().getTime();

animate();

function animate(){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);

    ctx.strokeStyle="black";
    ctx.beginPath();
    ctx.moveTo(0,stringHeight-margin*0.5);
    ctx.bezierCurveTo(
        myCanvas.width/4,stringHeight+margin,
        3*myCanvas.width/4,stringHeight+margin,
        myCanvas.width,stringHeight-margin*0.5
    );
    ctx.stroke();

    let changed=false;
    for(let i=0;i<socks.length;i++){
        changed=socks[i].draw(ctx)||changed;
        Physics.update(
            socks[i].particles,socks[i].segments
        );
    }

    changed=bird.draw(ctx)||changed;
    

    if(new Date().getTime()-startTime>1000 && !changed && moves.length>0){
        const nextMove=moves.shift();
        const [i,j]=nextMove.indices;
        if(nextMove.type=="swap"){
            socks[i].moveTo(socks[j].loc,tweenLength);
            socks[j].moveTo(socks[i].loc,tweenLength);
            bird.moveTo(socks[j].loc,socks[i].loc,false,tweenLength);
            [socks[i],socks[j]]=[socks[j],socks[i]];
        }else{ // bird is moving
            bird.moveTo(socks[i].loc,socks[j].loc,true,tweenLength);
        }
    }

    requestAnimationFrame(animate);
}

// offscreen fix
function quickSort(array) {
   const moves = [];

   function partition(left, right) {
       const pivot = array[Math.floor((left + right) / 2)];
       let i = left;
       let j = right;

       while (i <= j) {
           moves.push({
               indices: [i, j],
               type: "comparison"
           });

           while (array[i] < pivot) {
               i++;
               moves.push({
                   indices: [i, j],
                   type: "comparison"
               });
           }

           while (array[j] > pivot) {
               j--;
               moves.push({
                   indices: [i, j],
                   type: "comparison"
               });
           }

           if (i <= j) {
               if (i !== j) {
                   moves.push({
                       indices: [i, j],
                       type: "swap"
                   });
                   [array[i], array[j]] = [array[j], array[i]];
               }
               i++;
               j--;
           }
       }

       return i;
   }

   function quicksort(left, right) {
       if (array.length > 1) {
           const index = partition(left, right);
           if (left < index - 1) {
               quicksort(left, index - 1);
           }
           if (index < right) {
               quicksort(index, right);
           }
       }
   }

   quicksort(0, array.length - 1);
   return moves;
}

// offscreen fix
function insertionSort(array) {
   const moves = [];
   const n = array.length;

   for (let i = 1; i < n; i++) {
       let currentElement = array[i];
       let j = i - 1;

       while (j >= 0) {
           moves.push({
               indices: [j, j + 1],
               type: "comparison"
           });

           if (array[j] > currentElement) {
               array[j + 1] = array[j];
               moves.push({
                   indices: [j, j + 1],
                   type: "swap"
               });
           } else {
               break;
           }

           j--;
       }

       array[j + 1] = currentElement;
   }

   return moves;
}

function bubbleSort(array){
   const moves=[];
   let n=array.length;
   let left=1;
   do{
       var swapped=false;
       if((n-left)%2==1){
           for(let i=left;i<n;i++){
               moves.push({
                   indices:[i-1,i],
                   type:"comparison"
               });
               if(array[i-1]>array[i]){
                   swapped=true;
                   [array[i-1],array[i]]=[array[i],array[i-1]];
                   moves.push({
                       indices:[i-1,i],
                       type:"swap"
                   });
               }
           }
           n--;
       }else{
           for(let i=n-1;i>=left;i--){
               moves.push({
                   indices:[i-1,i],
                   type:"comparison"
               });
               if(array[i-1]>array[i]){
                   swapped=true;
                   [array[i-1],array[i]]=[array[i],array[i-1]];
                   moves.push({
                       indices:[i-1,i],
                       type:"swap"
                   });
               }
           }
           left++;
       }
   }while(swapped);
   return moves;
}