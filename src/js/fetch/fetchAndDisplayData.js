export default async function fetchAndDisplayData(url) {
  try {
    document.querySelector('#app').innerHTML = '';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error, something went wrong');
    }

    const data = await response.text();

    document.querySelector('#app').innerHTML = data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
}
