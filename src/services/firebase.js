import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, query, where, addDoc, documentId, writeBatch } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDi1i7XeD5kHsOg2eohDqd8QY0N0ZKGoxg",
    authDomain: "freakworlduy.firebaseapp.com",
    projectId: "freakworlduy",
    storageBucket: "freakworlduy.appspot.com",
    messagingSenderId: "24433298584",
    appId: "1:24433298584:web:ee8273eeb2cf949e1b54ed",
    measurementId: "G-WY89M19E55"
  };

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const DB = getFirestore(FirebaseApp);

/**
 * @func getItemsFromAPI
 * @desc Retorna un array con todos los productos guardados en firestore.
 * @returns {Array<*>} Array de productos
 * @async
 */
export async function getItemsFromAPI() {
    try {
        const CollectionProducts = collection(DB, 'products');
        let snapshot = (await getDocs(CollectionProducts)).docs;

        const products = snapshot.map(doc => {
            return {
                ...doc.data(), // Operador spread, saca y desarma todas las properties y las acomoda tal cual la id de arriba.
                id: doc.id
            };
        });

        return products;
    } catch (e) {
        console.error(e);
    }
}

/**
 * @func getSingleItemFromAPI
 * @desc Busca en firestore algún documento según una id.
 * @param {string} id ID del documento a buscar en firestore.
 * @returns {any} Documento mapeado, junto con su id.

 * @async
 */
export async function getSingleItemFromAPI(id) {
    try {
        const docRef = doc(DB, 'products', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new Error(`El documento con id ${id} no existe`);
        }
        return {
            ...docSnap.data(),
            id: docSnap.id
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * @func getItemsFromAPIByCategory
 * @summary Retorna un array de los productos en firestore, filtrando según categoría.
 * @param {string} category Categoría a usar para filtrar.
 * @returns {Array<any>} Array de objetos filtrados por categoría.
 * @async
 */
export async function getItemsFromAPIByCategory(category) {
    try {
        const productsRef = collection(DB, 'products');
        const q = query(productsRef, where('category', '==', category));

        const productsSnapshot = (await getDocs(q)).docs;

        const products = productsSnapshot.map(doc => {
            return {
                ...doc.data(), // Operador spread, saca y desarma todas las properties y las acomoda tal cual la id de arriba.
                id: doc.id
            };
        });

        return products;
    } catch (e) {
        console.error(e);
        return null;
    }
}

/**
 * @func createBuyOrderFS
 * @summary Genera un nuevo documento con los datos de la compra y del comprador que se agrega a la collection 'buyorders'.
 * @param {*} orderData Datos del comprador y de la compra.
 * @returns {string | null} Caso sin error: ID de la orden de compra, que es en realidad la ID del documento generado en la collection 'buyorders'. En error: null.
 * @async
 */
export async function createBuyOrderFS(orderData) {
    try {
        const colBuyOrdersRef = collection(DB, 'buyorders');
        const docRef = await addDoc(colBuyOrdersRef, orderData);
        return (docRef.id);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function createBuyOrderFSWithStock(orderData) {
    try {
        const colProductsRef = collection(DB, 'products');
        const colBuyOrdersRef = collection(DB, 'buyorders');
        const batch = writeBatch(DB);

        let arrayIds = orderData.items.map(item => item.id);
        const q = query(colProductsRef, where(documentId(), 'in', arrayIds) );
        let productsSnapshot = await getDocs(q);

        productsSnapshot.docs.forEach( (doc) => {
            let stockActual = doc.data().stock;
            let itemInCart = orderData.items.find( item => item.id === doc.id);
            let stockActualizado = stockActual - itemInCart.quantity;

            batch.update(doc.ref, { stock: stockActualizado});
        });

        const docOrderRef = doc(colBuyOrdersRef);
        batch.set(docOrderRef, orderData);

        await batch.commit();

        return docOrderRef.id;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getBuyOrderByID(id) {
    try {
        const docRef = doc(DB, 'buyorders', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new Error(`El documento con id ${id} no existe`);
        }
        return {
            ...docSnap.data(),
            date: docSnap._document.data.value.mapValue.fields.date.timestampValue
        };
    } catch (e) {
        console.error(e);
        return null;
    }
}
