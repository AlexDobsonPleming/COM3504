

const openNewDb = () => new Promise((resolve, reject) => {
    const requestIDB = indexedDB.open("plantsDB", 2);

    // Function to handle IndexedDB upgrade
    const handleUpgrade = (ev) => {
        const db = ev.target.result
        const plantsObjectStoreName = "plants";

        if (db.objectStoreNames.contains(plantsObjectStoreName)) {
            db.deleteObjectStore(plantsObjectStoreName);
        }

        // Create object store for plants with a key to the _id mongodb field
        db.createObjectStore(plantsObjectStoreName, { keyPath: "_id" })

        console.log("Upgraded object store...")
        const transaction = ev.target.transaction;
        transaction.oncomplete = () => {
            resolve(db)
        };

    }

    requestIDB.addEventListener("upgradeneeded", handleUpgrade)
    requestIDB.addEventListener("success", (event) => resolve(event.target.result))
    requestIDB.addEventListener("error", (err) => {
        alert("Database couldn't be created :(((( please fix this I really need this database...");
        reject("Database couldn't be created");
    })

})

let db;

const getDb = async () => {
    if (db === undefined) {
        db = await openNewDb();
    }
    return db;
}

const getPlants = async () => new Promise(async (resolve, reject) => {
    const plantIdb = await getDb();
    const transaction = plantIdb.transaction(["plants"])
    const plantStore = transaction.objectStore("plants")
    const getAllRequest = plantStore.getAll()
    getAllRequest.onsuccess = () => {
        const plants = getAllRequest.result // Now an array
        resolve(plants);
    };

    getAllRequest.onerror = reject;

});

const getPlant = async (plantId) => new Promise(async (resolve, reject) => {
    const plantIdb = await getDb();
    const transaction = plantIdb.transaction(["plants"])
    const plantStore = transaction.objectStore("plants")
    const getPlantRequest = plantStore.get(plantId)
    getPlantRequest.onsuccess = () => {
        const plant = getPlantRequest.result // Now an array
        resolve(plant);
    };

    getPlantRequest.onerror = reject;
})

const addPlant = async (newPlant) => new Promise(async (resolve, reject) => {
    const plantIDB = await getDb();
    const transactionInPlantStore = plantIDB.transaction(["plants"]);
    const plantStore = transactionInPlantStore.objectStore("plants");
    const addRequest = plantStore.add(newPlant);
    addRequest.onsuccess = resolve;
    addRequest.onerror = reject;
});

const reloadPlants = async (newPlants) => new Promise(async (resolve, reject) => {
    const plantIDB = await getDb();
    const transactionInPlantStore = plantIDB.transaction(["plants"], "readwrite");
    const plantStore = transactionInPlantStore.objectStore("plants");
    const clearRequest = plantStore.clear();

    clearRequest.onsuccess = () => {
        let complete = 0;
        newPlants.forEach(plant => {
            const addRequest = plantStore.add(plant);
            addRequest.onsuccess = () => {
                complete = complete + 1;
                if (complete === newPlants.length) {
                    resolve();
                }
            }
        })
    };

    transactionInPlantStore.onComplete = resolve;
    transactionInPlantStore.onError = reject;
});


export { getDb, getPlant, getPlants, addPlant, reloadPlants };