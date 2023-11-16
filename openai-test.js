import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages:[
        {"role": "system", "content": "You will be provided with a description of a mood, and your task is to generate the CSS code for a color that matches it. Write your output in json with a single key called 'css_code'."},
        {"role": "user", "content": "Blue sky at dusk."},
      ],
    temperature: 0,
    max_tokens: 1024,
});

console.log(response.choices[0].message);
