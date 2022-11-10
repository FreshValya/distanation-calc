type CitiesData = [string, number, number][];

const cities: CitiesData = [
  ['Paris', 48.856614, 2.352222],
  ['Marseille', 43.296482, 5.36978],
  ['Lyon', 45.764043, 4.835659],
  ['Toulouse', 43.604652, 1.444209],
  ['Nice', 43.710173, 7.261953],
  ['Nantes', 47.218371, -1.553621],
  ['Strasbourg', 48.573405, 7.752111],
  ['Montpellier', 43.610769, 3.876716],
  ['Bordeaux', 44.837789, -0.57918],
  ['Lille', 50.62925, 3.057256],
  ['Rennes', 48.117266, -1.677793],
  ['Reims', 49.258329, 4.031696],
  ['Le Havre', 49.49437, 0.107929],
  ['Saint-Étienne', 45.439695, 4.387178],
  ['Toulon', 43.124228, 5.928],
  ['Angers', 47.478419, -0.563166],
  ['Grenoble', 45.188529, 5.724524],
  ['Dijon', 47.322047, 5.04148],
  ['Nîmes', 43.836699, 4.360054],
  ['Aix-en-Provence', 43.529742, 5.447427],
];

const getCities = async (name: string) => {
  // if (name.length === 0) return [];

  return await new Promise<string[]>((resolve, reject) =>
    setTimeout(() => {
      if (name === 'fail') {
        reject(new Error('fail to call'));
      }
      resolve(
        cities.filter((city) => city[0].startsWith(name)).map((city) => city[0])
      );
    }, 1000)
  );
};

const getDistances = async (names: string[]) => {
  if (names.length === 0) return [];

  return await new Promise<CitiesData>((resolve, reject) =>
    setTimeout(() => {
      if (names.includes('Dijon')) {
        reject(new Error('Error: Dijon city selected'));
      }

      let result = [];
      for (let i = 0; i < names.length; i++) {
        if (names[i] !== names[i + 1]) {
          for (let j = 0; j < cities.length; j++) {
            if (cities[j][0] === names[i]) {
              result.push(cities[j]);
              break;
            }
          }
        }
      }
      resolve(result);
    }, 1000)
  );
};

export { getCities, getDistances };
export type { CitiesData };
