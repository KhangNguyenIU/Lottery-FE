export const timeLeft = time => Math.floor((time-Date.now()/1000)/60) >0 ? Math.floor((time-Date.now()/1000)/60 +1) : 0

export const generateNrandomArray = (numsOfArray, arraySize) =>{
    let arr =  Array.from(Array(numsOfArray)).fill(Array.from(Array(arraySize)).fill(0))
    return arr.map((n, index)=> n.map((x, index)=>randomNumber()))
}

export const randomNumber = ()=> Math.floor(Math.random(Date.now())*10)

export const test = ()=>{
    for(let i=0;i<5;i++){
        console.log(i ," : ", randomNumber() )
    }
}

export const isObjectEmpty = obj => Object.keys(obj).length === 0