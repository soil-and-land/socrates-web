export async function run({socrates, parameters}) {
  // const url = "/run"; // For debugging local when running vite in dev mode
  const url = "https://api.socrates-soil.net/run";

  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      socrates,
      parameters
    }),
  });
  let status = response.status;
  response = await response.json();
  if (status === 200) {
    return response;
  } else {
    throw new Error(response?.message);
  }
}

export async function parameters() {
  let response = await fetch('parameters.json');
  let status = response.status;
  response = await response.json();
  if (status === 200) {
    return response;
  } else {
    throw new Error(response?.message);
  }
}

export async function sampleData() {
  let response = await fetch('sample-data-20-year.json');
  if (response.status === 200) {
    response = await response.json();
    return response;
  }
}
