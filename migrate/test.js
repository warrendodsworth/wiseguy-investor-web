const data = {
  claims: {
    admin: false,
    mate: false,
  },
};

const trueClaims = {};

for (const claim in data.claims) {
  if (Object.hasOwnProperty.call(data.claims, claim)) {
    const value = data.claims[claim];
    if (value) {
      trueClaims[claim] = value;
    }
  }
}

console.log(trueClaims);
