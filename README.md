
## NodeJS API Reference
All process are here except processing-audio, go to Flask API

### Register User

```http
  POST https://apikomura-665606747903.asia-southeast2.run.app/register
```

#### Body
| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**. |
| `username` | `string` | **Required**. |

#### Response Example
```http
User created: 21tOUTQh4uY9JqifJvR9Glpb6dB3
```

### Get All Recording (Home)

```http
  GET https://apikomura-665606747903.asia-southeast2.run.app/get-recordings?userId=GJPRRG3ujaM8dXb4G7PAKL96uLp2
```

#### Parameters
| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. |

#### Response Example
```http
[
    {
        "id": "6KMpri7M6MF4FREMz8TN",
        "recordingTitle": "Nasi goreng enak tau",
        "audioUrl": "https://storage.googleapis.com/komura-audio-bucket/audio/GJPRRG3ujaM8dXb4G7PAKL96uLp2-1733548570.mp3",
        "transcribe": "Hi, my name is Iki. Abud is my brother, and just like my brother, there are 15 million occupational drivers in Indonesia according to the Statistic Agency of Indonesia. The occupational driver face similar challenges to Abud, and some even resort to preying on the sidewalk. The busy environment can be distracting, which can affect their prayers, such as forgetting the number of raka'at, mispronouncing the prayers, or not being able to focus. And also, it is dangerous to pray on the sidewalk. As occupational drivers, they often work long hours, sometimes up to 20 hours a day. This extensive commitment can make it challenging to fulfill the religious obligation of praying five times a day.",
        "fillers_count": 2,
        "duration": 56.917,
        "word_count": 117,
        "pace": "good",
        "wpm": 123.33749143489644,
        "confidence": 0.9503234624862671,
        "confidentLabel": 1,
        "createdAt": {
            "_seconds": 1733548578,
            "_nanoseconds": 559000000
        }
    },
    {
        "id": "BIaiUvyTZzO1kQfSk4wK",
        "recordingTitle": "Nasi goreng enak tau",
        "audioUrl": "https://storage.googleapis.com/komura-audio-bucket/audio/GJPRRG3ujaM8dXb4G7PAKL96uLp2-1733548657.mp3",
        "transcribe": "Hi, my name is Iki. Abud is my brother, and just like my brother, there are 15 million occupational drivers in Indonesia according to the Statistic Agency of Indonesia. The occupational driver face similar challenges to Abud, and some even resort to preying on the sidewalk. The busy environment can be distracting, which can affect their prayers, such as forgetting the number of raka'at, mispronouncing the prayers, or not being able to focus. And also, it is dangerous to pray on the sidewalk. As occupational drivers, they often work long hours, sometimes up to 20 hours a day. This extensive commitment can make it challenging to fulfill the religious obligation of praying five times a day.",
        "fillers_count": 2,
        "duration": 56.917,
        "word_count": 117,
        "pace": "good",
        "wpm": 123.33749143489644,
        "confidence": 0.9503234624862671,
        "confidentLabel": 1,
        "createdAt": {
            "_seconds": 1733548668,
            "_nanoseconds": 76000000
        }
    }
]
```

### Get Single Recording (Result Processing/Click Detail)

```http
  GET https://apikomura-665606747903.asia-southeast2.run.app/get-recording?userId=GJPRRG3ujaM8dXb4G7PAKL96uLp2&recordingId=6KMpri7M6MF4FREMz8TN
```

#### Parameters
| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. |
| `recordingId` | `string` | **Required**. |

#### Response Example
```http
{
    "id": "6KMpri7M6MF4FREMz8TN",
    "recordingTitle": "Nasi goreng enak tau",
    "audioUrl": "https://storage.googleapis.com/komura-audio-bucket/audio/GJPRRG3ujaM8dXb4G7PAKL96uLp2-1733548570.mp3",
    "transcribe": "Hi, my name is Iki. Abud is my brother, and just like my brother, there are 15 million occupational drivers in Indonesia according to the Statistic Agency of Indonesia. The occupational driver face similar challenges to Abud, and some even resort to preying on the sidewalk. The busy environment can be distracting, which can affect their prayers, such as forgetting the number of raka'at, mispronouncing the prayers, or not being able to focus. And also, it is dangerous to pray on the sidewalk. As occupational drivers, they often work long hours, sometimes up to 20 hours a day. This extensive commitment can make it challenging to fulfill the religious obligation of praying five times a day.",
    "fillers_count": 2,
    "duration": 56.917,
    "word_count": 117,
    "pace": "good",
    "wpm": 123.33749143489644,
    "confidence": 0.9503234624862671,
    "confidentLabel": 1,
    "createdAt": {
        "_seconds": 1733548578,
        "_nanoseconds": 559000000
    },
    "feedback": "Excellent work! You are very confident in your presentation, which is fantastic! Your speaking speed is too slow. Try to increase your pace slightly to keep your audience engaged. However, we noticed 2 filler words in your presentation. Reducing them will improve your clarity. "
}
```

### Rename Recording

```http
  POST https://apikomura-665606747903.asia-southeast2.run.app/rename-recording
```

#### Body
| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. |
| `recordingId` | `string` | **Required**. |
| `recordingTitle` | `string` | **Required**. |

#### Response Example
```http
Recording renamed successfully.
```


### Delete Recording

```http
  POST https://apikomura-665606747903.asia-southeast2.run.app/delete-recording
```

#### Body
| Field | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | **Required**. |
| `recordingId` | `string` | **Required**. |

#### Response Example
```http
Recording deleted successfully.
```

