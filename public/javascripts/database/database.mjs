function clearAllObjectStores(db) {
    const objectStoreNames = db.objectStoreNames;
    const length = objectStoreNames.length;

    for (let i = 0; i < length; i++) {
        db.deleteObjectStore(objectStoreNames.item(i));
    }
}

const openNewDb = () => new Promise((resolve, reject) => {
    const requestIDB = indexedDB.open("plantsDB", 3);

    // Function to handle IndexedDB upgrade
    const handleUpgrade = (ev) => {
        const db = ev.target.result;

        const objectStoreDesigns = [
            // Create object store for plants with a key to the _id mongodb field
            // server_plants is the client side cache of the plants from the server
            // it's data structure is that of those coming out of MongoDB
            // queued_plants is a client side queue of plants to upload
            // they have exactly the same structure, so they can be rendered using the same client render methods
            {
                name: "server_plants",
                keyPath: "_id"
            },
            {
                name: "queued_plants",
                keyPath: "_id"
            }
        ];

        clearAllObjectStores(db);

        objectStoreDesigns.forEach(objectModel => {
            db.createObjectStore(objectModel.name, { keyPath: objectModel.keyPath })
        })



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

const TransactionMode = {
    READ_ONLY: "readonly",
    READ_WRITE: "readwrite"
}

class ObjectStoreHandler {
    store_name = "";
    constructor(object_store_name) {
        this.store_name = object_store_name;
    }



    async getTransaction(accessMode) {
        const indexedDb = await getDb();
        return indexedDb.transaction([this.store_name], accessMode);
    }
    async getStore(accessMode = TransactionMode.READ_ONLY) {
        const transaction = await this.getTransaction(accessMode);
        return transaction.objectStore(this.store_name);
    }

    getAll = async () => new Promise(async (resolve, reject) => {
        const plantStore = await this.getStore();
        const getAllRequest = plantStore.getAll()
        getAllRequest.onsuccess = () => {
            const plants = getAllRequest.result // Now an array
            resolve(plants);
        };

        getAllRequest.onerror = reject;

    });

    get = async (plantId) => new Promise(async (resolve, reject) => {
        const plantStore = await this.getStore();
        const getPlantRequest = plantStore.get(plantId)
        getPlantRequest.onsuccess = () => {
            const plant = getPlantRequest.result // Now an array
            resolve(plant);
        };

        getPlantRequest.onerror = reject;
    })

    add = async (newPlant) => new Promise(async (resolve, reject) => {
        const plantStore = await this.getStore();
        const addRequest = plantStore.add(newPlant);
        addRequest.onsuccess = resolve;
        addRequest.onerror = reject;
    });

    reload = async (newPlants) => new Promise(async (resolve, reject) => {
        const transactionInPlantStore = await this.getTransaction(TransactionMode.READ_WRITE);
        const plantStore = transactionInPlantStore.objectStore(this.store_name);
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
}



export { getDb, ObjectStoreHandler };