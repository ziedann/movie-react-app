import { Client, Databases, ID, Query, Account } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://syd.cloud.appwrite.io/v1')
    .setProject('686624a700366ec0c47d');

const databases = new Databases(client);
const account = new Account(client);

const DATABASE_ID = '686627010026020e8b95';
const COLLECTION_ID = '68662736002c20b4a0f0';

// Create anonymous session if not exists
const ensureSession = async () => {
    try {
        const session = await account.get();
        return true;
    } catch (error) {
        try {
            await account.createAnonymousSession();
            return true;
        } catch (error) {
            console.error('Error with session:', error);
            return false;
        }
    }
};

// Initialize session
ensureSession();

export const updateSearchCount = async (searchTerm, movie) => {
    if (!searchTerm || !movie) return;
    
    try {
        // Ensure we have a session
        await ensureSession();

        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('searchTerm', searchTerm)
            ]
        );

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count: doc.count + 1
                }
            );
        } else {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: movie.poster_path ? 'https://image.tmdb.org/t/p/w500' + movie.poster_path : null
                }
            );
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
}

export const getSearchCount = async (searchTerm) => {
    if (!searchTerm) return 0;
    
    try {
        // Ensure we have a session
        await ensureSession();

        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('searchTerm', searchTerm)
            ]
        );
        return result.documents.length > 0 ? result.documents[0].count : 0;
    } catch (error) {
        console.error('Error getting search count:', error);
        return 0;
    }
}

export const getSearchHistory = async () => {
    try {
        // Ensure we have a session
        await ensureSession();

        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.orderDesc('$createdAt')
            ]
        );
        return result.documents;
    } catch (error) {
        console.error('Error getting search history:', error);
        return [];
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.limit(5),
                Query.orderDesc('count'),
            ]
        )

    return result.documents;
    } catch (error) {
        console.error('Error getting trending movies:', error);
        return [];
    }
}