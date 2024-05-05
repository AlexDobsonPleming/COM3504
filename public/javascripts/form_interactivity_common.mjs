// const getImageAsBase64 = async (file) => new Promise(async (resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = function(e) {
//         //resolve data URL back to caller
//         resolve(e.target.result);
//     };
//     // Try to read the file as a Data URL
//     try {
//         reader.readAsDataURL(file);
//     } catch (ex) {
//         reject(ex);
//     }
// });

function getImageAsBase64(file) {
    const reader = new FileReader()
    return new Promise(resolve => {
        reader.onload = ev => {
            resolve(ev.target.result)
        }
        reader.readAsDataURL(file)
    })
}

export { getImageAsBase64 }