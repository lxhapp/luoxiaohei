export default {
  InteractionCreate: {
    beta: {
      en: "<:dev:1297262773826486382> This command is currently in beta and only available to developers",
      ru: "<:dev:1297262773826486382> Эта команда находится в бета-версии и доступна только разработчикам",
      uk: "<:dev:1297262773826486382> Ця команда знаходиться в бета-версії та доступна тільки розробникам",
      ja: "<:dev:1297262773826486382> このコマンドは現在ベータ版で、開発者のみが利用できます",
    },
    cooldown: {
      en: "<:cross:1281580669373382686> Oh hey, take a relax before using **/{{command}}**. You can use your energy in {{time}}.",
      ru: "<:cross:1281580669373382686> Ой, пожалуйста, отдохните перед использованием **/{{command}}**. Вы можете использовать свою энергию через {{time}}.",
      uk: "<:cross:1281580669373382686> Ой, будь ласка, відпочивайте перед використанням **/{{command}}**. Ви можете використовувати свою енергію через {{time}}.",
      ja: "<:cross:1281580669373382686> ああ、**/{{command}}** を使用する前にリラックスしてください。{{time}} でエネルギーを使用できます。",
    },
    error: {
      command_not_found: {
        en: "<:cross:1281580669373382686> Command not found",
        ru: "<:cross:1281580669373382686> Команда не найдена",
        uk: "<:cross:1281580669373382686> Команду не знайдено",
        ja: "<:cross:1281580669373382686> コマンドが見つかりません",
      },
      interaction_invalid: {
        en: "<:cross:1281580669373382686> This interaction is no longer valid",
        ru: "<:cross:1281580669373382686> Это взаимодействие больше недействительно",
        uk: "<:cross:1281580669373382686> Ця взаємодія більше недійсна",
        ja: "<:cross:1281580669373382686> この操作は既に無効です",
      },
      timeout: {
        en: "<:cross:1281580669373382686> Command timed out",
        ru: "<:cross:1281580669373382686> Время выполнения команды истекло",
        uk: "<:cross:1281580669373382686> Час виконання команди минув",
        ja: "<:cross:1281580669373382686> コマンドがタイムアウトしました",
      },
      generic: {
        en: "<:cross:1281580669373382686> An error occurred while executing this command",
        ru: "<:cross:1281580669373382686> Произошла ошибка при выполнении этой команды",
        uk: "<:cross:1281580669373382686> Сталася помилка при виконанні цієї команди",
        ja: "<:cross:1281580669373382686> コマンドの実行中にエラーが発生しました",
      },
    },
  },

  balance: {
    error: {
      en: "Error fetching balance",
      ru: "Ошибка при получении баланса",
      uk: "Помилка при отриманні балансу",
      jp: "バランスを取得する際にエラーが発生しました",
    },
    selfview: {
      en: "Your balance: **{balance}¥**",
      ru: "Ваш баланс: **{balance}¥**",
      uk: "Ваш баланс: **{balance}¥**",
      jp: "あなたの残高: **{balance}¥**",
    },
    view: {
      en: "{user}'s balance: **{balance}¥**",
      ru: "Баланс {user}: **{balance}¥**",
      uk: "Баланс {user}: **{balance}¥**",
      jp: "{user}の残高: **{balance}¥**",
    },
  },

  inventory: {
    error: {
      en: "<:cross:1281580669373382686> An error occurred while fetching the inventory",
      ru: "<:cross:1281580669373382686> Произошла ошибка при получении инвентаря",
      uk: "<:cross:1281580669373382686> Сталася помилка при отриманні інвентарю",
      ja: "<:cross:1281580669373382686> インベントリの取得中にエラーが発生しました",
    },
    empty: {
      en: "<:cross:1281580669373382686> This inventory is empty!",
      ru: "<:cross:1281580669373382686> Этот инвентарь пуст!",
      uk: "<:cross:1281580669373382686> Цей інвентар порожній!",
      ja: "<:cross:1281580669373382686> このインベントリは空です！",
    },
    title: {
      en: "{user}'s Inventory",
      ru: "Инвентарь {user}",
      uk: "Інвентар {user}",
      ja: "{user}のインベントリ",
    },
    full: {
      en: "Inventory is full",
      ru: "Инвентарь полон",
      uk: "Інвентар повний",
      ja: "インベントリがいっぱいです",
    },
    slotsAvailable: {
      en: "{slots} slots available",
      ru: "Доступно слотов: {slots}",
      uk: "Доступно слотів: {slots}",
      ja: "利用可能なスロット：{slots}",
    },
    size: {
      en: "Inventory Size",
      ru: "Размер инвентаря",
      uk: "Розмір інвентарю",
      ja: "インベントリサイズ",
    },
  },

  leaderboard: {
    error: {
      en: "<:cross:1281580669373382686> Error fetching leaderboard data",
      ru: "<:cross:1281580669373382686> Ошибка при получении данных таблицы лидеров",
      uk: "<:cross:1281580669373382686> Помилка при отриманні даних таблиці лідерів",
      ja: "<:cross:1281580669373382686> リーダーボードデータの取得中にエラーが発生しました",
    },
    no_users: {
      en: "<:cross:1281580669373382686> No users found on the leaderboard",
      ru: "<:cross:1281580669373382686> Пользователи в таблице лдеров не найдены",
      uk: "<:cross:1281580669373382686> Користувачі в таблиці лідерів не знайдені",
      ja: "<:cross:1281580669373382686> リーダーボードにユーザーが見つかりません",
    },
    title: {
      en: "🏆 Richest Users",
      ru: "🏆 Самые богатые пользователи",
      uk: "🏆 Найбагатші користувачі",
      ja: "🏆 最も裕福なユーザー",
    },
    description: {
      en: "Here are the richest users in the economy!",
      ru: "Вот самые богатые пользователи в экономике!",
      uk: "Ось найбагатші користувачі в економіці!",
      ja: "経済で最も裕福なユーザーです！",
    },
    anonymous: {
      enabled: {
        en: "<:check:1281579844089675810> You are now anonymous on the leaderboard",
        ru: "<:check:1281579844089675810> Теперь вы анонимны в таблице лидеров",
        uk: "<:check:1281579844089675810> Тепер ви анонімні в таблиці лідерів",
        ja: "<:check:1281579844089675810> リーダーボードで匿名になりました",
      },
      disabled: {
        en: "<:check:1281579844089675810> You are no longer anonymous on the leaderboard",
        ru: "<:check:1281579844089675810> Вы больше не анонимны в таблице лидеров",
        uk: "<:check:1281579844089675810> Ви більше не анонімні в таблиці лідерів",
        ja: "<:check:1281579844089675810> リーダーボードで匿名ではなくなりました",
      },
    },
    errors: {
      create_user: {
        en: "<:cross:1281580669373382686> Error creating user profile",
        ru: "<:cross:1281580669373382686> Ошибка при создании профиля пользователя",
        uk: "<:cross:1281580669373382686> Помилка при створенні профілю користувача",
        ja: "<:cross:1281580669373382686> ユーザープロフィールの作成中にエラーが発生しました",
      },
      fetch_data: {
        en: "<:cross:1281580669373382686> Error fetching user data",
        ru: "<:cross:1281580669373382686> Ошибка при получении данных пользователя",
        uk: "<:cross:1281580669373382686> Помилка при отриманні даних користувача",
        ja: "<:cross:1281580669373382686> ユーザーデータの取得中にエラーが発生しました",
      },
      update_data: {
        en: "<:cross:1281580669373382686> Error updating user data",
        ru: "<:cross:1281580669373382686> Ошибка при обновлении данных пользователя",
        uk: "<:cross:1281580669373382686> Помилка при оновленні даних користувача",
        ja: "<:cross:1281580669373382686> ユーザーデータの更新中にエラーが発生しました",
      },
    },
  },

  sell: {
    available: {
      en: "available",
      ru: "доступно",
      uk: "доступно",
      ja: "利用可能",
    },
    database: {
      error: {
        en: "<:cross:1281580669373382686> Error fetching your inventory data",
        ru: "<:cross:1281580669373382686> Ошибка при получении данных инвентаря",
        uk: "<:cross:1281580669373382686> Помилка при отриманні даних інвентарю",
        ja: "<:cross:1281580669373382686> インベントリデータの取得中にエラーが発生しました",
      },
    },
    inventory: {
      empty: {
        en: "<:cross:1281580669373382686> Your inventory is empty",
        ru: "<:cross:1281580669373382686> Ваш инвентарь пуст",
        uk: "<:cross:1281580669373382686> Ваш інвентар порожній",
        ja: "<:cross:1281580669373382686> インベントリが空です",
      },
    },
    selectItemToSell: {
      en: "Select an item to sell from the dropdown menu",
      ru: "Выберите предмет для продажи из выпадающего меню",
      uk: "Виберіть предмет для продажу з випадаючого меню",
      ja: "ドロップダウンメニューから販売するアイテムを選択してください",
    },
    selectPlaceholder: {
      en: "Choose an item to sell",
      ru: "Выберите предмет для продажи",
      uk: "Виберіть предмет для продажу",
      ja: "販売するアイテムを選択",
    },
    one: {
      en: "Sell 1",
      ru: "Продать 1",
      uk: "Продати 1",
      ja: "1個売る",
    },
    five: {
      en: "Sell 5",
      ru: "Продать 5",
      uk: "Продати 5",
      ja: "5個売る",
    },
    ten: {
      en: "Sell 10",
      ru: "Продать 10",
      uk: "Продати 10",
      ja: "10個売る",
    },
    max: {
      en: "Sell All",
      ru: "Продать все",
      uk: "Продати все",
      ja: "全て売る",
    },
    skip: {
      en: "Skip",
      ru: "Пропустить",
      uk: "Пропустити",
      ja: "スキップ",
    },
    selectQuantityPreset: {
      en: "How many **{item}** would you like to sell?\nPrice per item: {price}¥",
      ru: "Сколько **{item}** вы хотите продать?\nЦена за штуку: {price}¥",
      uk: "Скільки **{item}** ви хочете продати?\nЦіна за штуку: {price}¥",
      ja: "**{item}**をいくつ売りますか？\n1個あたりの価格：{price}¥",
    },
    itemSoldAskMore: {
      en: "<:check:1281579844089675810> Successfully sold {amount}x **{item}** for {price}¥\nWould you like to sell more items?",
      ru: "<:check:1281579844089675810> Успешно продано {amount}x **{item}** за {price}¥\nХотите продать что-то еще?",
      uk: "<:check:1281579844089675810> Успішно продано {amount}x **{item}** за {price}¥\nБажаєте продати ще щось?",
      ja: "<:check:1281579844089675810> {amount}x **{item}**を{price}¥で売却しました\n他のアイテムも売りますか？",
    },
    more: {
      en: "Sell More",
      ru: "Продать еще",
      uk: "Продати ще",
      ja: "もっと売る",
    },
    finish: {
      en: "Finish",
      ru: "Завершить",
      uk: "Завершити",
      ja: "完了",
    },
    complete: {
      en: "<:check:1281579844089675810> Thank you for selling!",
      ru: "<:check:1281579844089675810> Спасибо за продажу!",
      uk: "<:check:1281579844089675810> Дякуємо за продаж!",
      ja: "<:check:1281579844089675810> 売却ありがとうございました！",
    },
    error: {
      en: "<:cross:1281580669373382686> An error occurred while processing the sale",
      ru: "<:cross:1281580669373382686> Произошла ошибка при обработке продажи",
      uk: "<:cross:1281580669373382686> Сталася помилка при обробці продажу",
      ja: "<:cross:1281580669373382686> 売却処理中にエラーが発生しました",
    },
    timeout: {
      en: "<:cross:1281580669373382686> Sell interaction timed out",
      ru: "<:cross:1281580669373382686> Время взаимодействия истекло",
      uk: "<:cross:1281580669373382686> Час взаємодії минув",
      ja: "<:cross:1281580669373382686> 売却インタラクションがタイムアウトしました",
    },
  },

  shop: {
    error: {
      en: "<:cross:1281580669373382686> An error occurred while fetching shop items",
      ru: "<:cross:1281580669373382686> Произошла ошибка при получении предметов магазина",
      uk: "<:cross:1281580669373382686> Сталася помилка при отриманні предметів магазину",
      ja: "<:cross:1281580669373382686> ショップアイテムの取得中にエラーが発生しました",
    },
    empty: {
      en: "<:cross:1281580669373382686> The shop is currently empty",
      ru: "<:cross:1281580669373382686> Магазин сейчас пуст",
      uk: "<:cross:1281580669373382686> Магазин зараз порожній",
      ja: "<:cross:1281580669373382686> 現在ショップは空です",
    },
    selectItemToBuy: {
      en: "Select an item to purchase from the dropdown menu",
      ru: "Выберите предмет для покупки из выпадающего меню",
      uk: "Виберіть предмет для покупки з випадаючого меню",
      ja: "ドロップダウンメニューから購入するアイテムを選択してください",
    },
    selectPlaceholder: {
      en: "Choose an item to buy",
      ru: "Выберите предмет для покупки",
      uk: "Виберіть предмет для покупки",
      ja: "購入するアイテムを選択",
    },
    buyOne: {
      en: "Buy 1",
      ru: "Купить 1",
      uk: "Купити 1",
      ja: "1個買う",
    },
    buyFive: {
      en: "Buy 5",
      ru: "Купить 5",
      uk: "Купити 5",
      ja: "5個買う",
    },
    buyTen: {
      en: "Buy 10",
      ru: "Купить 10",
      uk: "Купити 10",
      ja: "10個買う",
    },
    buyMax: {
      en: "Buy Max",
      ru: "Купить максимум",
      uk: "Купити максимум",
      ja: "最大数購入",
    },
    skipItem: {
      en: "Skip",
      ru: "Пропустить",
      uk: "Пропустити",
      ja: "スキップ",
    },
    selectQuantityPreset: {
      en: "How many **{item}** would you like to buy?\nCost per item: {cost}¥",
      ru: "Сколько **{item}** вы хотите купить?\nЦена за штуку: {cost}¥",
      uk: "Скільки **{item}** ви хочете купити?\nЦіна за штуку: {cost}¥",
      ja: "**{item}**をいくつ購入しますか？\n1個あたりの価格：{cost}¥",
    },
    inventoryFull: {
      en: "<:cross:1281580669373382686> Your inventory is full! You can't carry any more items",
      ru: "<:cross:1281580669373382686> Ваш инвентарь полон! Вы не можете нести больше предметов",
      uk: "<:cross:1281580669373382686> Ваш інвентар повний! Ви не можете нести більше предметів",
      ja: "<:cross:1281580669373382686> インベントリがいっぱいです！これ以上アイテムを持てません",
    },
    notEnoughBalance: {
      en: "<:cross:1281580669373382686> You don't have enough money to buy this",
      ru: "<:cross:1281580669373382686> У вас недостаточно денег для покупки",
      uk: "<:cross:1281580669373382686> У вас недостатньо грошей для покупки",
      ja: "<:cross:1281580669373382686> 購入するための所持金が足りません",
    },
    purchaseError: {
      en: "<:cross:1281580669373382686> An error occurred while processing your purchase",
      ru: "<:cross:1281580669373382686> Произошла ошибка при обработке вашей покупки",
      uk: "<:cross:1281580669373382686> Сталася помилка при обробці вашої покупки",
      ja: "<:cross:1281580669373382686> 購入処理中にエラーが発生しました",
    },
    itemPurchasedAskMore: {
      en: "<:check:1281579844089675810> Successfully purchased {quantity}x **{item}**!\nWould you like to buy more items?",
      ru: "<:check:1281579844089675810> Успешно куплено {quantity}x **{item}**!\nХотите купить что-то еще?",
      uk: "<:check:1281579844089675810> Успішно куплено {quantity}x **{item}**!\nБажаєте купити ще щось?",
      ja: "<:check:1281579844089675810> {quantity}x **{item}**を購入しました！\n他のアイテムも購入しますか？",
    },
    buyMore: {
      en: "Buy More",
      ru: "Купить еще",
      uk: "Купити ще",
      ja: "もっと買う",
    },
    finishShopping: {
      en: "Finish",
      ru: "Завершить",
      uk: "Завершити",
      ja: "完了",
    },
    shoppingComplete: {
      en: "<:check:1281579844089675810> Thank you for shopping!",
      ru: "<:check:1281579844089675810> Спасибо за покупку!",
      uk: "<:check:1281579844089675810> Дякуємо за покупку!",
      ja: "<:check:1281579844089675810> お買い上げありがとうございました！",
    },
    timeout: {
      en: "<:cross:1281580669373382686> Shop interaction timed out",
      ru: "<:cross:1281580669373382686> Время взаимодействия с магазином истекло",
      uk: "<:cross:1281580669373382686> Час взаємодії з магазином минув",
      ja: "<:cross:1281580669373382686> ショップインタラクションがタイムアウトしました",
    },
  },

  transfer: {
    bot: {
      en: "<:cross:1281580669373382686> You cannot transfer money to a bot",
      ru: "<:cross:1281580669373382686> Вы не можете перевести деньги боту",
      uk: "<:cross:1281580669373382686> Ви не можете перевести гроші боту",
      ja: "<:cross:1281580669373382686> ボットにお金を送ることはできません",
    },
    sameUser: {
      en: "<:cross:1281580669373382686> You cannot transfer money to yourself",
      ru: "<:cross:1281580669373382686> Вы не можете перевести деньги себе",
      uk: "<:cross:1281580669373382686> Ви не можете перевести гроші собі",
      ja: "<:cross:1281580669373382686> 自分自身にお金を送ることはできません",
    },
    error: {
      en: "<:cross:1281580669373382686> An error occurred while processing the transfer",
      ru: "<:cross:1281580669373382686> Произошла ошибка при обработке перевода",
      uk: "<:cross:1281580669373382686> Сталася помилка при обробці переводу",
      ja: "<:cross:1281580669373382686> 送金処理中にエラーが発生しました",
    },
    insufficientBalance: {
      en: "<:cross:1281580669373382686> You don't have enough money to make this transfer",
      ru: "<:cross:1281580669373382686> У вас недостаточно денег для этого перевода",
      uk: "<:cross:1281580669373382686> У вас недостатньо грошей для цього переводу",
      ja: "<:cross:1281580669373382686> この送金に必要な残高が不足しています",
    },
    confirmTitle: {
      en: "Confirm Transfer",
      ru: "Подтвердите перевод",
      uk: "Підтвердіть переказ",
      ja: "送金の確認",
    },
    confirmDescription: {
      en: "Are you sure you want to transfer **{amount}¥** to {user}?",
      ru: "Вы уверены, что хотите перевести **{amount}¥** пользователю {user}?",
      uk: "Ви впевнені, що хочете перевести **{amount}¥** користувачу {user}?",
      ja: "{user}に**{amount}¥**を送金してもよろしいですか？",
    },
    yes: {
      en: "Yes",
      ru: "Да",
      uk: "Так",
      ja: "はい",
    },
    no: {
      en: "No",
      ru: "Нет",
      uk: "Ні",
      ja: "いいえ",
    },
    success: {
      en: "<:check:1281579844089675810> Successfully transferred **{amount}¥** to {user}",
      ru: "<:check:1281579844089675810> Успешно переведено **{amount}¥** пользователю {user}",
      uk: "<:check:1281579844089675810> Успішно переведено **{amount}¥** користувачу {user}",
      ja: "<:check:1281579844089675810> {user}に**{amount}¥**を送金しました",
    },
    cancelled: {
      en: "<:cross:1281580669373382686> Transfer cancelled",
      ru: "<:cross:1281580669373382686> Перевод отменен",
      uk: "<:cross:1281580669373382686> Переказ скасовано",
      ja: "<:cross:1281580669373382686> 送金をキャンセルしました",
    },
  },

  work: {
    fish: {
      title: {
        en: "🎣 Fishing Time!",
        ru: "🎣 Время рыбалки!",
        uk: "🎣 Час рибалки!",
        ja: "🎣 釣りの時間！",
      },
      start: {
        en: "Time to go fishing! Catch {{caught}}/{{required}} fish",
        ru: "Пора на рыбалку! Поймано {{caught}}/{{required}} рыб",
        uk: "Час рибалити! Спіймано {{caught}}/{{required}} риб",
        ja: "釣りの時間です！ {{caught}}/{{required}} 匹の魚を捕まえました",
      },
      cast: {
        en: "Cast Line",
        ru: "Закинуть удочку",
        uk: "Закинути вудку",
        ja: "釣り糸を投げる",
      },
      caught: {
        en: "You caught a {{fish}}!",
        ru: "Вы поймали {{fish}}!",
        uk: "Ви спіймали {{fish}}!",
        ja: "{{fish}}を捕まえました！",
      },
      missed: {
        en: "The fish got away...",
        ru: "Рыба ушла...",
        uk: "Риба пішла...",
        ja: "魚が逃げました...",
      },
      progress: {
        en: "Progress",
        ru: "Прогресс",
        uk: "Прогрес",
        ja: "進捗",
      },
      difficulty: {
        en: "Difficulty",
        ru: "Сложность",
        uk: "Складність",
        ja: "難易度",
      },
      footer: {
        en: "Click the button to fish!",
        ru: "Нажмите кнопку, чтобы рыбачить!",
        uk: "Натисніть кнопку, щоб рибалити!",
        ja: "ボタンを押して釣りをしましょう！",
      },
      success: {
        en: "Fishing Complete!",
        ru: "Рыбалка завершена!",
        uk: "Рибалка завершена!",
        ja: "釣りが完了しました！",
      },
      reward: {
        en: "You earned {{amount}} yen from selling your fish!",
        ru: "Вы заработали {{amount}} йен от продажи рыбы!",
        uk: "Ви заробили {{amount}} єн від продажу риби!",
        ja: "魚を売って{{amount}}円を稼ぎました！",
      },
      timeout_title: {
        en: "Time's Up!",
        ru: "Время вышло!",
        uk: "Час вийшов!",
        ja: "時間切れ！",
      },
      timeout: {
        en: "You didn't catch enough fish in time.",
        ru: "Вы не поймали достаточно рыбы вовремя.",
        uk: "Ви не спіймали достатньо риби вчасно.",
        ja: "時間内に十分な魚を捕まえられませんでした。",
      },
      too_fast: {
        en: "Whoa! Wait a moment before casting again...",
        ru: "Подождите немного перед следующим забросом...",
        uk: "Зачекайте трохи перед наступним закиданням...",
        ja: "ちょっと待って！次の投げ込みまで少し待ってください...",
      },
    },
  },

  demotivator: {
    errors: {
      invalidImage: {
        en: "<:cross:1281580669373382686> Please provide a valid image file",
        ru: "<:cross:1281580669373382686> Пожалуйста, предоставьте действительный файл изображения",
        uk: "<:cross:1281580669373382686> Будь ласка, надайте дійсний файл зображення",
        ja: "<:cross:1281580669373382686> 有効な画像ファイルを提供してください",
      },
      creationFailed: {
        en: "<:cross:1281580669373382686> Failed to create demotivator. Please try again later",
        ru: "<:cross:1281580669373382686> Не удалось создать демотиватор. Пожалуйста, попробуйте позже",
        uk: "<:cross:1281580669373382686> Не вдалося створити демотиватор. Будь ласка, спробуйте пізніше",
        ja: "<:cross:1281580669373382686> デモチベーターの作成に失敗しました。後でもう一度お試しください",
      },
    },
  },

  fact: {
    description: "<:luo:1270401166731382867> {{fact}}",
    errors: {
      fetch: {
        en: "Failed to fetch a fact. Please try again later.",
        ru: "Не удалось получить факт. Пожалуйста, попробуйте позже.",
        uk: "Не вдалося отримати факт. Будь ласка, спробуйте пізніше.",
        jp: "失敗しました。後でもう一度お試しください。",
      },
    },
  },

  meme: {
    description: {
      en: "by u/{{author}} | r/{{subreddit}}",
      ru: "от u/{{author}} | r/{{subreddit}}",
      uk: "від u/{{author}} | r/{{subreddit}}",
      ja: "u/{{author}}によって | r/{{subreddit}}",
    },
    footer: {
      en: "⬆️ {{upvotes}}",
      ru: "⬆️ {{upvotes}}",
      uk: "⬆️ {{upvotes}}",
      ja: "⬆️ {{upvotes}}",
    },
    errors: {
      nsfw_content: {
        en: "Oops! The meme was NSFW. Try again!",
        ru: "Упс! Этот мем был NSFW. Попробуйте снова!",
        uk: "Упс! Мем був NSFW. Спробуйте ще раз!",
        ja: "おっと！そのミームはNSFWです。もう一度試してください！",
      },
      title: {
        en: "<:cross:1281580669373382686> Failed to fetch meme",
        ru: "<:cross:1281580669373382686> Не удалось загрузить мем",
        uk: "<:cross:1281580669373382686> Не вдалося завантажити мем",
        ja: "<:cross:1281580669373382686> メモをフェッチできませんでした",
      },
      fetch: {
        en: "Unable to retrieve a meme at the moment.",
        ru: "В данный момент невозможно получить мем.",
        uk: "Зараз неможливо отримати мем.",
        ja: "今はミームを取得できません。",
      },
    },
  },

  rps: {
    gameApp: {
      en: "<:cross:1281580669373382686> You can't play with a bot",
      ru: "<:cross:1281580669373382686> Вы не можете играть с ботом",
      uk: "<:cross:1281580669373382686> Ви не можете грати з ботом",
      ja: "<:cross:1281580669373382686> ボットとプレイすることはできません",
    },
    sameUser: {
      en: "<:cross:1281580669373382686> You can't play with yourself",
      ru: "<:cross:1281580669373382686> Вы не можете играть с собой",
      uk: "<:cross:1281580669373382686> Ви не можете грати з собою",
      ja: "<:cross:1281580669373382686> 自分自身とプレイすることはできません",
    },
    title: {
      en: "Rock Paper Scissors",
      ru: "Камень Ножницы Бумага",
      uk: "Камінь Ножиці Папір",
      ja: "じゃんけん",
    },
    description: {
      en: "Click a button to make your choice!",
      ru: "Нажмите кнопку, чтобы сделать свой выбор!",
      uk: "Натисніть кнопку, щоб зробити свій вибір!",
      ja: "ボタンを押して選択してください！",
    },
    rock: {
      en: "Rock",
      ru: "Камень",
      uk: "Камінь",
      ja: "グー",
    },
    paper: {
      en: "Paper",
      ru: "Бумага",
      uk: "Папір",
      ja: "パー",
    },
    scissors: {
      en: "Scissors",
      ru: "Ножницы",
      uk: "Ножиці",
      ja: "チョキ",
    },
    pick: {
      en: "You picked {emoji}",
      ru: "Вы выбрали {emoji}",
      uk: "Ви обрали {emoji}",
      ja: "あなたは {emoji} を選びました",
    },
    win: {
      en: "{player} won the game! Congratulations!",
      ru: "{player} выиграл игру! Поздравляем!",
      uk: "{player} виграв гру! Вітаємо!",
      ja: "{player} が勝ちました！おめでとうございます！",
    },
    tie: {
      en: "It's a tie! Both players picked {emoji}",
      ru: "Ничья! Оба игрока выбрали {emoji}",
      uk: "Нічия! Обидва гравці обрали {emoji}",
      ja: "引き分けです！両プレイヤーとも {emoji} を選びました",
    },
    timeout: {
      en: "Game timed out! No one made a choice",
      ru: "Время игры истекло! Никто не сделал выбор",
      uk: "Час гри минув! Ніхто не зробив вибір",
      ja: "タイムアウトしました！選択がありませんでした",
    },
    onPOnly: {
      en: "Only {player} and {opponent} can use these buttons",
      ru: "Только {player} и {opponent} могут использовать эти кнопки",
      uk: "Тільки {player} та {opponent} можуть використовувати ці кнопки",
      ja: "これらのボタンは {player} と {opponent} のみが使用できます",
    },
  },

  tictactoe: {
    gameApp: {
      en: "<:cross:1281580669373382686> You can't play with a bot",
      ru: "<:cross:1281580669373382686> Вы не можете играть с ботом",
      uk: "<:cross:1281580669373382686> Ви не можете грати з ботом",
      ja: "<:cross:1281580669373382686> ボットとプレイすることはできません",
    },
    sameUser: {
      en: "<:cross:1281580669373382686> You can't play with yourself",
      ru: "<:cross:1281580669373382686> Вы не можете играть с собой",
      uk: "<:cross:1281580669373382686> Ви не можете грати з собою",
      ja: "<:cross:1281580669373382686> 自分自身とプレイすることはできません",
    },
    title: {
      en: "Tic Tac Toe",
      ru: "Крестики-нолики",
      uk: "Хрестики-нулики",
      ja: "○×ゲーム",
    },
    status: {
      en: "Game Status",
      ru: "Статус игры",
      uk: "Статус гри",
      ja: "ゲームステータス",
    },
    over: {
      en: "Game Over",
      ru: "Игра окончена",
      uk: "Гра закінчена",
      ja: "ゲーム終了",
    },
    turn: {
      en: "It's {player}'s turn!",
      ru: "Ход {player}!",
      uk: "Хід {player}!",
      ja: "{player}の番です！",
    },
    win: {
      en: "{player} won the game!",
      ru: "{player} выиграл игру!",
      uk: "{player} виграв гру!",
      ja: "{player}が勝ちました！",
    },
    tie: {
      en: "It's a tie!",
      ru: "Ничья!",
      uk: "Нічия!",
      ja: "引き分けです！",
    },
    timeout: {
      en: "Game timed out!",
      ru: "Время игры истекло!",
      uk: "Час гри минув!",
      ja: "タイムアウトしました！",
    },
    onPOnly: {
      en: "Only {player} and {opponent} can use these buttons",
      ru: "Только {player} и {opponent} могут использовать эти кнопки",
      uk: "Тільки {player} та {opponent} можуть використовувати ці кнопки",
      ja: "これらのボタンは {player} と {opponent} のみが使用できます",
    },
  },

  luoinfo: {
    userNotFound: {
      en: "<:cross:1281580669373382686> User not found",
      ru: "<:cross:1281580669373382686> Пользователь не найден",
      uk: "<:cross:1281580669373382686> Користувача не знайдено",
      ja: "<:cross:1281580669373382686> ユーザーが見つかりません",
    },
    databaseError: {
      en: "<:cross:1281580669373382686> An error occurred while fetching user data",
      ru: "<:cross:1281580669373382686> Произошла ошибка при получении данных пользователя",
      uk: "<:cross:1281580669373382686> Сталася помилка при отриманні даних користувача",
      ja: "<:cross:1281580669373382686> ユーザーデータの取得中にエラーが発生しました",
    },
    isRegistered: {
      en: "Registered",
      ru: "Зарегистрирован",
      uk: "Зареєстрований",
      ja: "登録済み",
    },
    balance: {
      en: "Balance",
      ru: "Баланс",
      uk: "Баланс",
      ja: "残高",
    },
  },

  profile: {
    userNotFound: {
      en: "<:cross:1281580669373382686> User not found",
      ru: "<:cross:1281580669373382686> Пользователь не найден",
      uk: "<:cross:1281580669373382686> Користувача не знайдено",
      ja: "<:cross:1281580669373382686> ユーザーが見つかりません",
    },
  },

  serverinfo: {
    nope: {
      en: "None",
      ru: "Отсутствует",
      uk: "Відсутній",
      ja: "なし",
    },
    low: {
      en: "Low",
      ru: "Низкий",
      uk: "Низький",
      ja: "低",
    },
    mid: {
      en: "Medium",
      ru: "Средний",
      uk: "Середній",
      ja: "中",
    },
    high: {
      en: "High",
      ru: "Высокий",
      uk: "Високий",
      ja: "高",
    },
    veryhigh: {
      en: "Very High",
      ru: "Очень высокий",
      uk: "Дуже високий",
      ja: "最高",
    },
    name: {
      en: "Server Name",
      ru: "Название сервера",
      uk: "Назва серверу",
      ja: "サーバー名",
    },
    creation: {
      en: "Created",
      ru: "Создан",
      uk: "Створено",
      ja: "作成日",
    },
    owner: {
      en: "Owner",
      ru: "Владелец",
      uk: "Власник",
      ja: "オーナー",
    },
    members: {
      en: "Members",
      ru: "Участники",
      uk: "Учасники",
      ja: "メンバー数",
    },
    roles: {
      en: "Roles",
      ru: "Роли",
      uk: "Ролі",
      ja: "ロール数",
    },
    emojis: {
      en: "Emojis",
      ru: "Эмодзи",
      uk: "Емодзі",
      ja: "絵文字数",
    },
    veriflvl: {
      en: "Verification Level",
      ru: "Уровень проверки",
      uk: "Рівень перевірки",
      ja: "認証レベル",
    },
    boosts: {
      en: "Boosts",
      ru: "Бустов",
      uk: "Бустів",
      ja: "ブースト数",
    },
  },

  stats: {
    servercount: {
      en: "Total Servers",
      ru: "Всего серверов",
      uk: "Всього серверів",
      ja: "サーバー総数",
    },
    membercount: {
      en: "Total Members",
      ru: "Всего участников",
      uk: "Всього учасників",
      ja: "メンバー総数",
    },
  },

  whois: {
    userNotFound: {
      en: "<:cross:1281580669373382686> User not found",
      ru: "<:cross:1281580669373382686> Пользователь не найден",
      uk: "<:cross:1281580669373382686> Користувача не знайдено",
      ja: "<:cross:1281580669373382686> ユーザーが見つかりません",
    },
    member: {
      en: "Member",
      ru: "Участник",
      uk: "Учасник",
      ja: "メンバー",
    },
    roles: {
      en: "Roles",
      ru: "Роли",
      uk: "Ролі",
      ja: "ロール",
    },
    joinedAt: {
      en: "Joined At",
      ru: "Присоединился",
      uk: "Приєднався",
      ja: "参加日",
    },
    createdAt: {
      en: "Account Created",
      ru: "Аккаунт создан",
      uk: "Аккаунт створено",
      ja: "アカウント作成日",
    },
  },

  automod: {
    errors: {
      noPermission: {
        en: "<:cross:1281580669373382686> I need the `Manage Server` permission to configure AutoMod rules",
        ru: "<:cross:1281580669373382686> Мне нужно разрешение `Управление сервером` для настройки правил AutoMod",
        uk: "<:cross:1281580669373382686> Мені потрібен дозвіл `Керування сервером` для налаштування правил AutoMod",
        ja: "<:cross:1281580669373382686> AutoModルールを設定するには`サーバーの管理`権限が必要です",
      },
      alreadyExists: {
        en: "<:cross:1281580669373382686> This AutoMod rule already exists in this server",
        ru: "<:cross:1281580669373382686> Это правило AutoMod уже существует на этом сервере",
        uk: "<:cross:1281580669373382686> Це правило AutoMod вже існує на цьому сервері",
        ja: "<:cross:1281580669373382686> このAutoModルールは既にこのサーバーに存在します",
      },
      maxRulesExceeded: {
        en: "<:cross:1281580669373382686> Maximum number of rules of this type has been reached",
        ru: "<:cross:1281580669373382686> Достигнуто максимальное количество правил этого типа",
        uk: "<:cross:1281580669373382686> Досягнуто максимальну кількість правил цього типу",
        ja: "<:cross:1281580669373382686> このタイプのルールの最大数に達しました",
      },
      error: {
        en: "<:cross:1281580669373382686> An error occurred while creating the AutoMod rule",
        ru: "<:cross:1281580669373382686> Произошла ошибка при создании правила AutoMod",
        uk: "<:cross:1281580669373382686> Сталася помилка під час створення правила AutoMod",
        ja: "<:cross:1281580669373382686> AutoModルールの作成中にエラーが発生しました",
      },
    },
    success: {
      en: "<:check:1281579844089675810> Successfully created AutoMod rule",
      ru: "<:check:1281579844089675810> Правило AutoMod успешно создано",
      uk: "<:check:1281579844089675810> Правило AutoMod успішно створено",
      ja: "<:check:1281579844089675810> AutoModルールが正常に作成されました",
    },
  },

  ban: {
    errors: {
      guildOnly: {
        en: "<:cross:1281580669373382686> This command can only be used in a server",
        ru: "<:cross:1281580669373382686> Эта команда может быть использована только на сервере",
        uk: "<:cross:1281580669373382686> Ця команда може бути використана тільки на сервері",
        ja: "<:cross:1281580669373382686> このコマンドはサーバーでのみ使用できます",
      },
      cannotBanSelf: {
        en: "<:cross:1281580669373382686> You cannot ban yourself",
        ru: "<:cross:1281580669373382686> Вы не можете заблокировать себя",
        uk: "<:cross:1281580669373382686> Ви не можете заблокувати себе",
        ja: "<:cross:1281580669373382686> 自分自身をバンすることはできません",
      },
      cannotBanBot: {
        en: "<:cross:1281580669373382686> I cannot ban myself",
        ru: "<:cross:1281580669373382686> Я не могу заблокировать себя",
        uk: "<:cross:1281580669373382686> Я не можу заблокувати себе",
        ja: "<:cross:1281580669373382686> 自分自身をバンすることはできません",
      },
      cannotBanUser: {
        en: "<:cross:1281580669373382686> I cannot ban this user",
        ru: "<:cross:1281580669373382686> Я не могу заблокировать этого пользователя",
        uk: "<:cross:1281580669373382686> Я не можу заблокувати цього користувача",
        ja: "<:cross:1281580669373382686> このユーザーをバンすることはできません",
      },
      higherRole: {
        en: "<:cross:1281580669373382686> You cannot ban someone with a higher or equal role",
        ru: "<:cross:1281580669373382686> Вы не можете заблокировать пользователя с более высокой или равной ролью",
        uk: "<:cross:1281580669373382686> Ви не можете заблокувати користувача з вищою або рівною роллю",
        ja: "<:cross:1281580669373382686> 自分より上位または同等の役職を持つユーザーをバンすることはできません",
      },
      banFailed: {
        en: "<:cross:1281580669373382686> Failed to ban the user",
        ru: "<:cross:1281580669373382686> Не удалось заблокировать пользователя",
        uk: "<:cross:1281580669373382686> Не вдалося заблокувати користувача",
        ja: "<:cross:1281580669373382686> ユーザーのバンに失敗しました",
      },
    },
    dm: {
      title: {
        en: "You have been banned",
        ru: "Вы были заблокированы",
        uk: "Вас було заблоковано",
        ja: "あなたはバンされました",
      },
    },
    success: {
      title: {
        en: "User Banned",
        ru: "Пользователь заблокирован",
        uk: "Користувача заблоковано",
        ja: "ユーザーがバンされました",
      },
    },
    fields: {
      server: {
        en: "Server",
        ru: "Сервер",
        uk: "Сервер",
        ja: "サーバー",
      },
      moderator: {
        en: "Moderator",
        ru: "Модератор",
        uk: "Модератор",
        ja: "モデレーター",
      },
      reason: {
        en: "Reason",
        ru: "Причина",
        uk: "Причина",
        ja: "理由",
      },
      noReason: {
        en: "No reason provided",
        ru: "Причина не указана",
        uk: "Причина не вказана",
        ja: "理由は指定されていません",
      },
      bannedUser: {
        en: "Banned User",
        ru: "Заблокированный пользователь",
        uk: "Заблокований користувач",
        ja: "バンされたユーザー",
      },
      bannedBy: {
        en: "Banned By",
        ru: "Заблокировал",
        uk: "Заблокував",
        ja: "バンした人",
      },
      messageDeletion: {
        en: "Message Deletion",
        ru: "Удаление сообщений",
        uk: "Видалення повідомлень",
        ja: "メッセージの削除",
      },
      days: {
        en: "days",
        ru: "дней",
        uk: "днів",
        ja: "日",
      },
    },
    footer: {
      moderation: {
        en: "Server Moderation",
        ru: "Модерация сервера",
        uk: "Модерація сервера",
        ja: "サーバーモデレーション",
      },
    },
  },

  kick: {
    errors: {
      userNotInServer: {
        en: "<:cross:1281580669373382686> This user is not in the server",
        ru: "<:cross:1281580669373382686> Этого пользователя нет на сервере",
        uk: "<:cross:1281580669373382686> Цього користувача немає на сервері",
        ja: "<:cross:1281580669373382686> このユーザーはサーバーにいません",
      },
      cannotKickUser: {
        en: "<:cross:1281580669373382686> I cannot kick this user",
        ru: "<:cross:1281580669373382686> Я не могу исключить этого пользователя",
        uk: "<:cross:1281580669373382686> Я не можу вигнати цього користувача",
        ja: "<:cross:1281580669373382686> このユーザーをキックすることはできません",
      },
      higherRole: {
        en: "<:cross:1281580669373382686> You cannot kick someone with a higher or equal role",
        ru: "<:cross:1281580669373382686> Вы не можете исключить пользователя с более высокой или равной ролью",
        uk: "<:cross:1281580669373382686> Ви не можете вигнати користувача з вищою або рівною роллю",
        ja: "<:cross:1281580669373382686> 自分より上位または同等の役職を持つユーザーをキックすることはできません",
      },
      kickFailed: {
        en: "<:cross:1281580669373382686> Failed to kick the user",
        ru: "<:cross:1281580669373382686> Не удалось исключить пользователя",
        uk: "<:cross:1281580669373382686> Не вдалося вигнати користувача",
        ja: "<:cross:1281580669373382686> ユーザーのキックに失敗しました",
      },
    },
    dm: {
      title: {
        en: "You have been kicked",
        ru: "Вы были исключены",
        uk: "Вас було вигнано",
        ja: "あなたはキックされました",
      },
      description: {
        en: "You have been kicked from **{server}**\nReason: {reason}",
        ru: "Вы были исключены с сервера **{server}**\nПричина: {reason}",
        uk: "Вас було вигнано з серверу **{server}**\nПричина: {reason}",
        ja: "**{server}**からキックされました\n理由: {reason}",
      },
    },
    success: {
      message: {
        en: "<:check:1281579844089675810> Successfully kicked **{user}**\nReason: {reason}",
        ru: "<:check:1281579844089675810> Пользователь **{user}** успешно исключен\nПричина: {reason}",
        uk: "<:check:1281579844089675810> Користувача **{user}** успішно вигнано\nПричина: {reason}",
        ja: "<:check:1281579844089675810> **{user}**をキックしました\n理由: {reason}",
      },
    },
    reason: {
      none: {
        en: "No reason provided",
        ru: "Причина не указана",
        uk: "Причина не вказана",
        ja: "理由は指定されていません",
      },
    },
  },

  purge: {
    errors: {
      noPerms: {
        en: "<:cross:1281580669373382686> I need `Manage Messages` and `View Channel` permissions to purge messages",
        ru: "<:cross:1281580669373382686> Мне нужны права `Управление сообщениями` и `Просмотр канала` для очистки сообщений",
        uk: "<:cross:1281580669373382686> Мені потрібні права `Керування повідомленнями` та `Перегляд каналу` для видалення повідомлень",
        ja: "<:cross:1281580669373382686> メッセージを一括削除するには`メッセージの管理`と`チャンネルの閲覧`権限が必要です",
      },
      noMessages: {
        en: "<:cross:1281580669373382686> No messages found to delete",
        ru: "<:cross:1281580669373382686> Не найдено сообщений для удаления",
        uk: "<:cross:1281580669373382686> Не знайдено повідомлень для видалення",
        ja: "<:cross:1281580669373382686> 削除するメッセージが見つかりません",
      },
    },
    success: {
      en: "<:check:1281579844089675810> Successfully deleted ${fetchedMessages} messages",
      ru: "<:check:1281579844089675810> Успешно удалено ${fetchedMessages} сообщений",
      uk: "<:check:1281579844089675810> Успішно видалено ${fetchedMessages} повідомлень",
      ja: "<:check:1281579844089675810> ${fetchedMessages}件のメッセージを削除しました",
    },
  },

  timeout: {
    errors: {
      guildOnly: {
        en: "<:cross:1281580669373382686> This command can only be used in a server",
        ru: "<:cross:1281580669373382686> Эта команда может быть использована только на сервере",
        uk: "<:cross:1281580669373382686> Ця команда може бути використана тільки на сервері",
        ja: "<:cross:1281580669373382686> このコマンドはサーバーでのみ使用できます",
      },
      cannotTimeoutSelf: {
        en: "<:cross:1281580669373382686> You cannot timeout yourself",
        ru: "<:cross:1281580669373382686> Вы не можете ограничить себя",
        uk: "<:cross:1281580669373382686> Ви не можете обмежити себе",
        ja: "<:cross:1281580669373382686> 自分自身をタイムアウトすることはできません",
      },
      cannotTimeoutBot: {
        en: "<:cross:1281580669373382686> I cannot be timed out",
        ru: "<:cross:1281580669373382686> Меня нельзя ограничить",
        uk: "<:cross:1281580669373382686> Мене не можна обмежити",
        ja: "<:cross:1281580669373382686> ボットをタイムアウトすることはできません",
      },
      invalidDurationFormat: {
        en: "<:cross:1281580669373382686> Invalid duration format. Use: 1m, 1h, or 1d",
        ru: "<:cross:1281580669373382686> Неверный формат длительности. Используйте: 1m, 1h или 1d",
        uk: "<:cross:1281580669373382686> Невірний формат тривалості. Використовуйте: 1m, 1h або 1d",
        ja: "<:cross:1281580669373382686> 無効な期間形式です。1m、1h、または1dを使用してください",
      },
      durationTooLong: {
        en: "<:cross:1281580669373382686> Timeout duration cannot exceed 28 days",
        ru: "<:cross:1281580669373382686> Длительность ограничения не может превышать 28 дней",
        uk: "<:cross:1281580669373382686> Тривалість обмеження не може перевищувати 28 днів",
        ja: "<:cross:1281580669373382686> タイムアウト期間は28日を超えることはできません",
      },
      userNotInServer: {
        en: "<:cross:1281580669373382686> This user is not in the server",
        ru: "<:cross:1281580669373382686> Этого пользователя нет на сервере",
        uk: "<:cross:1281580669373382686> Цього користувача немає на сервері",
        ja: "<:cross:1281580669373382686> このユーザーはサーバーにいません",
      },
      cannotTimeoutUser: {
        en: "<:cross:1281580669373382686> I cannot timeout this user",
        ru: "<:cross:1281580669373382686> Я не могу ограничить этого пользователя",
        uk: "<:cross:1281580669373382686> Я не можу обмежити цього користувача",
        ja: "<:cross:1281580669373382686> このユーザーをタイムアウトすることはできません",
      },
      higherRole: {
        en: "<:cross:1281580669373382686> You cannot timeout someone with a higher or equal role",
        ru: "<:cross:1281580669373382686> Вы не можете ограничить пользователя с более высокой или равной ролью",
        uk: "<:cross:1281580669373382686> Ви не можете обмежити користувача з вищою або рівною роллю",
        ja: "<:cross:1281580669373382686> 自分より上位または同等の役職を持つユーザーをタイムアウトすることはできません",
      },
      timeoutFailed: {
        en: "<:cross:1281580669373382686> Failed to timeout the user",
        ru: "<:cross:1281580669373382686> Не удалось ограничить пользователя",
        uk: "<:cross:1281580669373382686> Не вдалося обмежити користувача",
        ja: "<:cross:1281580669373382686> ユーザーのタイムアウトに失敗しました",
      },
    },
    dm: {
      title: {
        en: "You have been timed out",
        ru: "Вы были ограничены",
        uk: "Вас було обмежено",
        ja: "あなたはタイムアウトされました",
      },
      description: {
        en: "You have been timed out in **{server}**\nDuration: {duration}\nReason: {reason}",
        ru: "Вы были ограничены на сервере **{server}**\nДлительность: {duration}\nПричина: {reason}",
        uk: "Вас було обмежено на сервері **{server}**\nТривалість: {duration}\nПричина: {reason}",
        ja: "**{server}**でタイムアウトされました\n期間: {duration}\n理由: {reason}",
      },
    },
    success: {
      message: {
        en: "<:check:1281579844089675810> Successfully timed out **{user}**\nDuration: {duration}\nReason: {reason}",
        ru: "<:check:1281579844089675810> Пользователь **{user}** успешно ограничен\nДлительность: {duration}\nПричина: {reason}",
        uk: "<:check:1281579844089675810> Користувача **{user}** успішно обмежено\nТривалість: {duration}\nПричина: {reason}",
        ja: "<:check:1281579844089675810> **{user}**をタイムアウトしました\n期間: {duration}\n理由: {reason}",
      },
    },
    reason: {
      none: {
        en: "No reason provided",
        ru: "Причина не указана",
        uk: "Причина не вказана",
        ja: "理由は指定されていません",
      },
    },
  },

  os: {
    host: {
      en: "🖥️ Hostname",
      ru: "🖥️ Имя хоста",
      uk: "🖥️ Ім'я хоста",
      ja: "🖥️ ホスト名",
    },
    ram: {
      en: "💾 RAM Usage",
      ru: "💾 Использование ОЗУ",
      uk: "💾 Використання ОЗП",
      ja: "💾 メモリ使用量",
    },
    cpu: {
      en: "⚡ CPU Model",
      ru: "⚡ Модель процессора",
      uk: "⚡ Модель процесора",
      ja: "⚡ CPUモデル",
    },
    arch: {
      en: "🔧 Architecture",
      ru: "🔧 Архитектура",
      uk: "🔧 Архітектура",
      ja: "🔧 アーキテクチャ",
    },
    release: {
      en: "📟 OS Release",
      ru: "📟 Версия ОС",
      uk: "📟 Версія ОС",
      ja: "📟 OSバージョン",
    },
  },

  ping: {
    pinging: {
      en: "🏓 Pinging...",
      ru: "🏓 Измеряю пинг...",
      uk: "🏓 Вимірюю пінг...",
      ja: "🏓 ピンを測定中...",
    },
    ms: {
      en: "ms",
      ru: "мс",
      uk: "мс",
      ja: "ミリ秒",
    },
  },

  ascii: {
    errors: {
      fontInvalid: {
        en: "<:cross:1281580669373382686> Invalid font! Check available fonts at http://www.figlet.org/examples.html",
        ru: "<:cross:1281580669373382686> Неверный шрифт! Проверьте доступные шрифты на http://www.figlet.org/examples.html",
        uk: "<:cross:1281580669373382686> Невірний шрифт! Перевірте доступні шрифти на http://www.figlet.org/examples.html",
        ja: "<:cross:1281580669373382686> 無効なフォントです！利用可能なフォントは http://www.figlet.org/examples.html で確認できます",
      },
      asciiLong: {
        en: "<:cross:1281580669373382686> The resulting ASCII art is too long! Try a shorter text or different font",
        ru: "<:cross:1281580669373382686> Получившийся ASCII-арт слишком длинный! Попробуйте более короткий текст или другой шрифт",
        uk: "<:cross:1281580669373382686> Отриманий ASCII-арт занадто довгий! Спробуйте коротший текст або інший шрифт",
        ja: "<:cross:1281580669373382686> 生成されたASCIIアートが長すぎます！短いテキストか別のフォントを試してください",
      },
      asciiError: {
        en: "<:cross:1281580669373382686> An error occurred while generating ASCII art",
        ru: "<:cross:1281580669373382686> Произошла ошибка при создании ASCII-арта",
        uk: "<:cross:1281580669373382686> Сталася помилка при створенні ASCII-арту",
        ja: "<:cross:1281580669373382686> ASCIIアートの生成中にエラーが発生しました",
      },
    },
    success: {
      en: "<:check:1281579844089675810> Here's your ASCII art!",
      ru: "<:check:1281579844089675810> Вот ваш ASCII-арт!",
      uk: "<:check:1281579844089675810> Ось ваш ASCII-арт!",
      ja: "<:check:1281579844089675810> ASCIIアートができました！",
    },
  },

  atbash: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert the text",
      ru: "Не удалось преобразовать текст",
      uk: "Не вдалося перетворити текст",
      ja: "テキストの変換に失敗しました",
    },
  },

  base64: {
    error: {
      en: "Failed to process the text. Please try again.",
      ru: "Не удалось обработать текст. Пожалуйста, попробуйте еще раз.",
      uk: "Не вдалося обробити текст. Будь ласка, спробуйте ще раз.",
      ja: "テキストの処理に失敗しました。もう一度お試しください。",
    },
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    encoded: {
      en: "Encoded",
      ru: "Зашифровано",
      uk: "Зашифровано",
      ja: "エンコード",
    },
    decoded: {
      en: "Decoded",
      ru: "Расшифровано",
      uk: "Розшифровано",
      ja: "デコード",
    },
  },

  binary: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert. Make sure you're using valid binary format (0s and 1s with spaces)",
      ru: "Не удалось преобразовать. Убедитесь, что вы используете правильный двоичный формат (0 и 1 с пробелами)",
      uk: "Не вдалося перетворити. Переконайтеся, що ви використовуєте правильний двійковий формат (0 та 1 з пробілами)",
      ja: "変換に失敗しました。有効なバイナリ形式を使用していることを確認してください（0と1、スペース区切り）",
    },
    title: {
      en: "Binary Converter",
      ru: "Конвертер двоичного кода",
      uk: "Конвертер двійкового коду",
      ja: "バイナリコンバーター",
    },
    success: {
      en: "Successfully converted!",
      ru: "Успешно преобразовано!",
      uk: "Успішно перетворено!",
      ja: "変換に成功しました！",
    },
  },

  caesar: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    shift: {
      en: "Shift Amount",
      ru: "Величина сдвига",
      uk: "Величина зсуву",
      ja: "シフト量",
    },
    error: {
      en: "Failed to convert. Make sure you're using valid text and shift amount",
      ru: "Не удалось преобразовать. Проверьте текст и величину сдвига",
      uk: "Не вдалося перетворити. Перевірте текст та величину зсуву",
      ja: "変換に失敗しました。有効なテキストとシフト量を使用していることを確認してください",
    },
  },

  hex: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert. Make sure you're using valid hexadecimal format",
      ru: "Не удалось преобразовать. Убедитесь, что вы используете правильный шестнадцатеричный формат",
      uk: "Не вдалося перетворити. Переконайтеся, що ви використовуєте правильний шістнадцятковий формат",
      ja: "変換に失敗しました。有効な16進数形式を使用していることを確認してください",
    },
  },

  leet: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert to leetspeak",
      ru: "Не удалось преобразовать в leetspeak",
      uk: "Не вдалося перетворити в leetspeak",
      ja: "leetspeak への変換に失敗しました",
    },
  },

  morse: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert the text. Make sure you're using valid Morse code (. - / and spaces)",
      ru: "Не удалось преобразовать текст. Убедитесь, что вы используете правильный код Морзе (. - / и пробелы)",
      uk: "Не вдалося перетворити текст. Переконайтеся, що ви використовуєте правильний код Морзе (. - / та пробіли)",
      ja: "テキストの変換に失敗しました。有効なモールス信号を使用していることを確認してください（. - / とスペース）",
    },
    title: {
      en: "Morse Code Converter",
      ru: "Конвертер кода Морзе",
      uk: "Конвертер коду Морзе",
      ja: "モールス信号コンバーター",
    },
    success: {
      en: "Successfully converted!",
      ru: "Успешно преобразовано!",
      uk: "Успішно перетворено!",
      ja: "変換に成功しました！",
    },
  },

  nato: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert to NATO phonetic alphabet",
      ru: "Не удалось преобразовать в фонетический алфавит НАТО",
      uk: "Не вдалося перетворити у фонетичний алфавіт НАТО",
      ja: "NATO音標文字への変換に失敗しました",
    },
  },

  piglatin: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert the text",
      ru: "Не удалось преобразовать текст",
      uk: "Не вдалося перетворити текст",
      ja: "テキストの変換に失敗しました",
    },
  },

  railfence: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    rails: {
      en: "Rails",
      ru: "Рельсы",
      uk: "Рейки",
      ja: "レール",
    },
    error: {
      en: "Failed to convert. Check your text and number of rails",
      ru: "Не удалось преобразовать. Проверьте текст и количество рельсов",
      uk: "Не вдалося перетворити. Перевірте текст та кількість рейок",
      ja: "変換に失敗しました。テキストとレールの数を確認してください",
    },
  },

  reverse: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    mode: {
      en: "Mode",
      ru: "Режим",
      uk: "Режим",
      ja: "モード",
    },
    error: {
      en: "Failed to reverse the text",
      ru: "Не удалось перевернуть текст",
      uk: "Не вдалося перевернути текст",
      ja: "テキストの反転に失敗しました",
    },
  },

  rot13: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert the text",
      ru: "Не удалось преобразовать текст",
      uk: "Не вдалося перетворити текст",
      ja: "テキストの変換に失敗しました",
    },
    title: {
      en: "ROT13 Cipher",
      ru: "Шифр ROT13",
      uk: "Шифр ROT13",
      ja: "ROT13暗号",
    },
    success: {
      en: "Successfully converted!",
      ru: "Успешно преобразовано!",
      uk: "Успішно перетворено!",
      ja: "変換に成功しました！",
    },
  },

  rot47: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert the text",
      ru: "Не удалось преобразовать текст",
      uk: "Не вдалося перетворити текст",
      ja: "テキストの変換に失敗しました",
    },
  },

  url: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    error: {
      en: "Failed to convert. Make sure you're using valid URL-encoded text",
      ru: "Не удалось преобразовать. Убедитесь, что текст правильно URL-кодирован",
      uk: "Не вдалося перетворити. Переконайтеся, що текст правильно URL-кодований",
      ja: "変換に失敗しました。有効なURLエンコードされたテキストを使用していることを確認してください",
    },
  },

  vigenere: {
    input: {
      en: "Input",
      ru: "Ввод",
      uk: "Введення",
      ja: "入力",
    },
    key: {
      en: "Key",
      ru: "Ключ",
      uk: "Ключ",
      ja: "キー",
    },
    error: {
      en: "Failed to convert. Make sure you're using valid text and key",
      ru: "Не удалось преобразовать. Убедитесь в правильности текста и ключа",
      uk: "Не вдалося перетворити. Переконайтеся у правильності тексту та ключа",
      ja: "変換に失敗しました。有効なテキストとキーを使用していることを確認してください",
    },
  },

  ben: {
    name: {
      en: "Ben",
      ru: "Бен",
      uk: "Бен",
      ja: "ベン",
    },
    yes: {
      en: "Yes",
      ru: "Да",
      uk: "Так",
      ja: "はい",
    },
    no: {
      en: "No",
      ru: "Нет",
      uk: "Ні",
      ja: "いいえ",
    },
  },

  cat: {
    title: {
      en: "Random Cat",
      ru: "Случайная кошка",
      uk: "Випадковий кіт",
      ja: "ランダムな猫",
    },
    errors: {
      fail: {
        en: "<:cross:1281580669373382686> Failed to fetch a cat image. Please try again later!",
        ru: "<:cross:1281580669373382686> Не удалось получить изображение кошки. Пожалуйста, попробуйте позже!",
        uk: "<:cross:1281580669373382686> Не вдалося отримати зображення кота. Будь ласка, спробуйте пізніше!",
        ja: "<:cross:1281580669373382686> 猫の画像の取得に失敗しました。後でもう一度お試しください！",
      },
    },
  },

  dog: {
    title: {
      en: "Random Dog",
      ru: "Случайная собака",
      uk: "Випадкова собака",
      ja: "ランダムな犬",
    },
    errors: {
      fail: {
        en: "<:cross:1281580669373382686> Failed to fetch a dog image. Please try again later!",
        ru: "<:cross:1281580669373382686> Не удалось получить изображение собаки. Пожалуйста, попробуйте позже!",
        uk: "<:cross:1281580669373382686> Не вдалося отримати зображення собаки. Будь ласка, спробуйте пізніше!",
        ja: "<:cross:1281580669373382686> 犬の画像の取得に失敗しました。後でもう一度お試しください！",
      },
    },
  },

  invite: {
    title: {
      en: "≽^•⩊•^≼ Invite Luo Xiaohei",
      ru: "≽^•⩊•^≼ Пригласить Ло Сяохэя",
      uk: "≽^•⩊•^≼ Запросити Ло Сяохея",
      ja: "≽^•⩊•^≼ ロシャオヘイを招待",
    },
    description: {
      en:
        "### ≽^•⩊•^≼ What does Luo Xiaohei can do? Well...\n" +
        "- **😂 Get your daily dose of trivia: Use /fact to generate a random interesting fact!**\n" +
        "- **🐾 Cat & Dog Lovers rejoice! Use /cat for adorable cat pictures and /dog for pawsome pup pics!**\n" +
        "- **🎲 Feeling lucky? Test your luck with /luck and see if you can match the random & result values!**\n" +
        "- **🖼️ Show off your profile: Get your or someone else's profile picture with /profile.**\n" +
        "- **⏲️ Create custom timestamps: Design your own timestamp format messages with /timestamp.**\n" +
        "- **👤 User Info at your fingertips: Use /whois to see detailed information about any user.**\n" +
        "**...and more! *More features are coming soon, meow!***\n\n" +
        "*You can install Luo Xiaohei as User, but some commands will being not to show, which means they are for only guilds. No, Luo doesn't ask you to log in your account.*",

      ru:
        "### ≽^•⩊•^≼ Что умеет Ло Сяохэй? Ну...\n" +
        "- **😂 Получайте ежедневную порцию интересных фактов: Используйте /fact для генерации случайного интересного факта!**\n" +
        "- **🐾 Любителям кошек и собак радуйтесь! Используйте /cat для милых фотографий кошек и /dog для классных фотографий щенков!**\n" +
        "- **🎲 Чувствуете себя удачливым? Проверьте свою удачу с помощью /luck и посмотрите, совпадут ли случайные значения!**\n" +
        "- **🖼️ Покажите свой профиль: Получите свою или чью-то аватарку с помощью /profile.**\n" +
        "- **⏲️ Создавайте временные метки: Создавайте свои форматированные сообщения с временными метками с помощью /timestamp.**\n" +
        "- **👤 Информация о пользователе под рукой: Используйте /whois для просмотра подробной информации о любом пользователе.**\n" +
        "**...и многое другое! *Скоро появятся новые функции, мяу!***\n\n" +
        "*Вы можете установить Ло Сяохэя как пользователя, но некоторые команды не будут отображаться, так как они предназначены только для серверов. Нет, Ло не просит вас входить в свой аккаунт.*",

      uk:
        "### ≽^•⩊•^≼ Що вміє Ло Сяохей? Ну...\n" +
        "- **😂 Отримуйте щоденну порцію цікавих фактів: Використовуйте /fact для генерації випадкового цікавого факту!**\n" +
        "- **🐾 Любителям котів і собак радійте! Використовуйте /cat для милих фотографій котів і /dog для класних фотографій цуценят!**\n" +
        "- **🎲 Відчуваєте себе щасливим? Перевірте свою удачу за допомогою /luck і подивіться, чи співпадуть випадкові значення!**\n" +
        "- **🖼️ Покажіть свій профіль: Отримайте свою чи чиюсь аватарку за допомогою /profile.**\n" +
        "- **⏲️ Створюйте часові мітки: Створюйте свої форматовані повідомлення з часовими мітками за допомогою /timestamp.**\n" +
        "- **👤 Інформація про користувача під рукою: Використовуйте /whois для перегляду детальної інформації про будь-якого користувача.**\n" +
        "**...і багато іншого! *Скоро з'являться нові функції, няв!***\n\n" +
        "*Ви можете встановити Ло Сяохея як користувача, але деякі команди не відображатимуться, оскільки вони призначені тільки для серверів. Ні, Ло не просить вас входити у свій акаунт.*",

      ja:
        "### ≽^•⩊•^≼ ロシャオヘイには何ができるの？そうですね...\n" +
        "- **😂 日替わりの豆知識: /factで面白いランダムな事実を生成できます！**\n" +
        "- **🐾 猫と犬の愛好家の皆さん、お楽しみに！/catで可愛い猫の写真、/dogで素敵な子犬の写真が見られます！**\n" +
        "- **🎲 運試しをしてみませんか？/luckでランダムな値とのマッチングに挑戦！**\n" +
        "- **🖼️ プロフィールを見せよう：/profileで自分や他の人のプロフィール画像を取得できます。**\n" +
        "- **⏲️ カスタムタイムスタンプを作成：/timestampで独自のタイムスタンプ形式のメッセージをデザインできます。**\n" +
        "- **👤 ユーザー情報を手軽に：/whoisで任意のユーザーの詳細情報を確認できます。**\n" +
        "**...そしてもっと！*新機能は近日公開予定、ニャー！***\n\n" +
        "*ロシャオヘイをユーザーとしてインストールできますが、一部のコマンドはサーバー専用のため表示されません。アカウントへのログインは要求しません。*",
    },
    button: {
      en: "Invite Me!",
      ru: "Пригласить!",
      uk: "Запросити!",
      ja: "招待する！",
    },
  },

  joinus: {
    description: {
      en: "≽^•⩊•^≼ Welcome to Luo Cat!\nJoin our community to get news about updates, report bugs, suggest features, and chat with other users!",
      ru: "≽^•⩊•^≼ Добро пожаловать в Luo Cat!\nПрисоединяйтесь к нашему сообществу, чтобы получать новости об обновлениях, сообщать об ошибках, предлагать функции и общаться с другими пользователями!",
      uk: "≽^•⩊•^≼ Ласкаво просимо до Luo Cat!\nПриєднуйтесь до нашої спільноти, щоб отримувати новини про оновлення, повідомляти про помилки, пропонувати функції та спілкуватися з іншими користувачами!",
      ja: "≽^•⩊•^≼ Luo Catへようこそ！\nアップデートのニュース、バグ報告、機能の提案、他のユーザーとのチャットのためにコミュニティに参加しましょう！",
    },
    buttonNotWorking: {
      en: "Button not working? Use this link:",
      ru: "Кнопка не работает? Используйте эту ссылку:",
      uk: "Кнопка не працює? Використовуйте це посилання:",
      ja: "ボタンが機能しない場合はこちらのリンクをご利用ください：",
    },
  },

  luck: {
    luckyrandom: {
      en: "🍀 Lucky! The numbers matched!",
      ru: "🍀 Повезло! Числа совпали!",
      uk: "🍀 Пощастило! Числа співпали!",
      ja: "🍀 ラッキー！数字が一致しました！",
    },
    unluckyrandom: {
      en: "💔 Unlucky! The numbers didn't match!",
      ru: "💔 Не повезло! Числа не совпали!",
      uk: "💔 Не пощастило! Числа не співпали!",
      ja: "💔 アンラッキー！数字が一致しませんでした！",
    },
    random: {
      en: "🎲 Random",
      ru: "🎲 Случайное",
      uk: "🎲 Випадкове",
      ja: "🎲 ランダム",
    },
    result: {
      en: "🎯 Result",
      ru: "🎯 Результат",
      uk: "🎯 Результат",
      ja: "🎯 結果",
    },
  },

  namemc: {
    skins: {
      en: "Skins",
      ru: "Скины",
      uk: "Скіни",
      ja: "スキン",
    },
    capes: {
      en: "Capes",
      ru: "Плащи",
      uk: "Плащі",
      ja: "マント",
    },
    error: {
      en: "Player not found or API error occurred",
      ru: "Игрок не найден или произошла ошибка API",
      uk: "Гравця не знайдено або сталася помилка API",
      ja: "プレイヤーが見つからないか、APIエラーが発生しました",
    },
    player: {
      en: "Player",
      ru: "Игрок",
      uk: "Гравець",
      ja: "プレイヤー",
    },
    uuid: {
      en: "UUID",
      ru: "UUID",
      uk: "UUID",
      ja: "UUID",
    },
    description: {
      en: "Get Minecraft player information from NameMC",
      ru: "Получить информацию об игроке Minecraft из NameMC",
      uk: "Отримати інформацію про гравця Minecraft з NameMC",
      ja: "NameMCからMinecraftプレイヤー情報を取得",
    },
    username: {
      en: "Minecraft username",
      ru: "Имя игрока Minecraft",
      uk: "Ім'я гравця Minecraft",
      ja: "Minecraftのユーザー名",
    },
    uuid_desc: {
      en: "Minecraft UUID",
      ru: "UUID игрока Minecraft",
      uk: "UUID гравця Minecraft",
      ja: "MinecraftのUUID",
    },
  },

  timestamp: {
    placeholder: {
      en: "Select a timestamp format",
      ru: "Выберите формат временной метки",
      uk: "Виберіть формат мітки часу",
      ja: "タイムスタンプ形式を選択",
    },
    time_1desc: {
      en: "Shows time in 24-hour format",
      ru: "Показывает время в 24-часовом формате",
      uk: "Показує час у 24-годинному форматі",
      ja: "24時間形式で時刻を表示",
    },
    time_2desc: {
      en: "Shows time with seconds",
      ru: "Показывает время с секундами",
      uk: "Показує час із секундами",
      ja: "秒を含めた時刻を表示",
    },
    time_3desc: {
      en: "Shows short date",
      ru: "Показывает короткую дату",
      uk: "Показує коротку дату",
      ja: "短い日付を表示",
    },
    time_4desc: {
      en: "Shows long date",
      ru: "Показывает полную дату",
      uk: "Показує повну дату",
      ja: "長い日付を表示",
    },
    time_5desc: {
      en: "Shows date and time",
      ru: "Показывает дату и время",
      uk: "Показує дату та час",
      ja: "日付と時刻を表示",
    },
    time_6desc: {
      en: "Shows full date and time",
      ru: "Показывает полную дату и время",
      uk: "Показує повну дату та час",
      ja: "完全な日付と時刻を表示",
    },
    time_7desc: {
      en: "Shows relative time",
      ru: "Показывает относительное время",
      uk: "Показує відносний час",
      ja: "相対時間を表示",
    },
    time_1label: {
      en: "January 1, 1970",
      ru: "1 января 1970",
      uk: "1 січня 1970",
      ja: "1970年1月1日",
    },
    time_2label: {
      en: "January 1, 1970 0:00",
      ru: "1 января 1970 0:00",
      uk: "1 січня 1970 0:00",
      ja: "1970年1月1日 0:00",
    },
    time_3label: {
      en: "Thursday, January 1, 1970 0:00",
      ru: "Четверг, 1 января 1970 0:00",
      uk: "Четвер, 1 січня 1970 0:00",
      ja: "1970年1月1日木曜日 0:00",
    },
    time_4label: {
      en: "Time ago",
      ru: "Прошло времени",
      uk: "Пройшло часу",
      ja: "経過時間",
    },
  },

  wordle: {
    solution: {
      en: "🎯 Solution",
      ru: "🎯 Решение",
      uk: "🎯 Рішення",
      ja: "🎯 解答",
    },
    printdate: {
      en: "📅 Print Date",
      ru: "📅 Дата публикации",
      uk: "📅 Дата публікації",
      ja: "📅 公開日",
    },
    dayssincelaunch: {
      en: "🚀 Days Since Launch",
      ru: "🚀 Дней с запуска",
      uk: "🚀 Днів з запуску",
      ja: "🚀 開始からの日数",
    },
    editor: {
      en: "✏️ Editor",
      ru: "✏️ Редактор",
      uk: "✏️ Редактор",
      ja: "✏️ 編集者",
    },
    err: {
      en: "<:cross:1281580669373382686> Failed to fetch Wordle data. Status code: {code}",
      ru: "<:cross:1281580669373382686> Не удалось получить данные Wordle. Статусный код: {code}",
      uk: "<:cross:1281580669373382686> Не вдалося отримати дані Wordle. Статусний код: {code}",
      ja: "<:cross:1281580669373382686> Wordleデータの取得に失敗しました。ステータスコード: {code}",
    },
  },
};
