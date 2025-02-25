export async function getPayeeInfo(identifier) {
  try {
    const response = await fetch(`https://5d07-103-208-224-66.ngrok-free.app/auth/user/find?identifier=${identifier}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Payee Info:", data);
    return data;
  } catch (error) {
    console.error("Error fetching payee info:", error);
  }
}

export async function getPayerInfo() {
  try {
    const response = await fetch(`https://5d07-103-208-224-66.ngrok-free.app/auth/user/`);
     if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Payer Info:", data);
    return data;
  } catch (error) {
    console.error("Error fetching payer info:", error);
  }
}
