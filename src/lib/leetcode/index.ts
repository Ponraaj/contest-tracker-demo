// const getLeetCodeUserDetails = async (username: string) => {
//   try {
//     // Send the username to your custom API endpoint
//     const response = await fetch('/pages/api/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch data');
//     }

//     const userDetails = await response.json();
//     console.log('User Details:', userDetails);

//     // Since we only have contest data now, adjust the return structure
//     return {
//       username: username || 'N/A',
//       contestRanking: userDetails || [], // Assuming the API returns an array directly
//     };
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// export default getLeetCodeUserDetails;

const getLeetCodeUserDetails = async (username: string) => {
  try {
    const response = await fetch('/pages/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const userDetails = await response.json();
    console.log('User Details:', userDetails);

    return {
      username: username || 'N/A',
      contestRanking: userDetails.contestRanking || [],
      problemsSolved: userDetails.problemsSolved || [],
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default getLeetCodeUserDetails;