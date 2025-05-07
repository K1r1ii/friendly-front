const BASE_URL = 'http://80.90.186.9:8000'; //todo: поменять после деплоя бэка

/*
Общая функция для получения данных от API 
*/
export async function fetchData(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
}
