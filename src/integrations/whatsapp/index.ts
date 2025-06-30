import axios from "axios";

export async function sendMessage(numero: string) {
  try {
    const response = await axios.post(
      "https://v2-api.gzappy.com/message/send-text",
      {
        phone: numero,
        message: "Isso é um teste",
      },
      {
        headers: {
          Authorization: Bearer ${process.env.TOKEN_API_WHATSAPP},
        },
      }
    );

    console.log("Mensagem enviado com sucesso !");
  } catch (error) {
    console.log(error);
  }
}