export async function run({socrates, parameters}) {
  let response = await fetch("/run", {
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

export async function sampleData() {
  let response = await fetch('/sample-data-20-year.json');
  if (response.status === 200) {
    response = await response.json();
    return response;
  }
}
