const uri = "https://data.nasa.gov/resource/y77d-th95.json";

export async function getImpactData() {
  let result = await fetch(uri);
  let data = await result.json();

  return data;
}
