
let generator: ReturnType<typeof setInterval>;

export function activateGen(){
    console.log('Generator activated!');
    generator = setInterval(generateTS, 1000);
}

export function deactivateGen(){
    clearInterval(generator);
    console.log('Generator deactivated!');
}

function generateTS() {
    console.log(`ping : ${new Date()}`)
}