# Backend
1.Mongostore
app.use(session({
    store: MongoStore.create({
    mongoUrl: 'mongodb://localhost/test-app',
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  }),
  and other session related feilds
  }
));

2.Cors 
// Enable CORS (Cross-Origin Resource Sharing)
// - Allows frontend (http://localhost:5173) to communicate with backend
// - credentials: true allows cookies/sessions to be shared
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));