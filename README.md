# 💰 Gulden

### Gulden, an expense tracker.

Expense tracker web application created to visualise your spending habits and to help you save money.

The app uses [Next.js](https://nextjs.org) under the hood along with:

- Native [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/) for the database
- [NextAuth](https://next-auth.js.org/) for authentication
- [SWR](https://swr.vercel.app/) for data fetching
- [Mantine](https://mantine.dev/) for the UI

<!-- ### [Live demo](https://gulden.ofekasido.xyz/) -->

## ✨ Features

- Google OAuth2 authentication
- Beautiful, responsive UI
- Add expenses
- Remove expenses
- Filter expenses by week/month/year
- Show a nice graph of your expenses

## 🐳 Usage

### For development, use this:

```docker
$ docker compose up --build --force-recreate
```

### For production, use this:

```docker
$ docker compose -f docker-compose.production.yml up -d
```

## 💡 List of ideas

- [ ] Add a "monthly budget" feature
- [ ] Add a "monthly savings goal" feature
- [ ] Add a "monthly savings progress" feature
- [ ] Add a "debt" feature
- [ ] Add a currency selector

## 📸 Screenshots

<img src="https://imgur.com/vvhVEQn.png" />
<img src="https://imgur.com/TJvFVZW.png" />
<img src="https://imgur.com/2Rt5enJ.png" />
<img src="https://imgur.com/VqzvNEo.png" />

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

[MIT](https://choosealicense.com/licenses/mit/)
