During my time in undergrad, I worked on a small team of three to design and build a native iOS personal finance tracking applicaiton.
The app allows users to securely integrate multiple bank accounts using the Plaid API. To support realistic testing, we implimented a demo
environment that leveraged sandbox ACH accounts to simulate real-world financial integrations. 
This applications performs an initial scan of connected accounts to establish a spending baseline, after which users submit personalized financial
goals. Transactions are automatically categorized into predefined groups such as Retail, Food, and Travel using a combination of banking transaction
data and Apple's Vision ML for reciept scanning and parsing. By analyzing this data, the app provides insights and recommendations to help users
adjust their spending habits to better align with their finanical goals.