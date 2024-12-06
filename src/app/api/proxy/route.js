export async function GET(req) {
    try {
        // Extrae los parámetros de la URL
        const { searchParams } = new URL(req.url);
        const apiUrl = `https://sellercenter-api.falabella.com/?${searchParams.toString()}`;

        // Realiza la solicitud a la API externa
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json', // Indicamos que esperamos JSON
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la API externa: ${response.statusText}`);
        }

        // Obtenemos directamente la respuesta JSON
        const data = await response.json();

        // Retornamos la respuesta al cliente
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}
