# Responses from Teachable API

## `/courses`

```json
{
  "courses": [
    {
      "id": 2002430,
      "description": null,
      "name": "Trees and Arboreous Concerns",
      "heading": "Grow Your Knowledge of Trees and Arboreous Concerns - Learn From the Expert!",
      "is_published": true,
      "image_url": "https://cdn.filestackcontent.com/HfhcrIRZKEyvND8blEXA"
    },
    {
      "id": 2002431,
      "description": null,
      "name": "Mushroom Madness",
      "heading": "Unlock the Secrets of Mushroom Foraging with Mushroom Madness",
      "is_published": true,
      "image_url": "https://cdn.filestackcontent.com/MKdUddC0R9iLDP27yF1L"
    },
    {
      "id": 2002434,
      "description": null,
      "name": "Flower Buddies",
      "heading": "Unlock the Joy of Gardening with Flower Buddies",
      "is_published": false,
      "image_url": "https://cdn.filestackcontent.com/qBILoskzSVi5XDiCUUFz"
    },
    {
      "id": 2002435,
      "description": null,
      "name": "Growing Delicious Heirloom Tomatoes",
      "heading": "Grow your own flavorful heirlooms with our easy-to-follow online course",
      "is_published": false,
      "image_url": "https://cdn.filestackcontent.com/yZk8KM8KQrOk2VLWnVGi"
    },
    {
      "id": 2002436,
      "description": null,
      "name": "Herbal Teas & Other Garden Tinctures",
      "heading": "Brew your own natural remedies with Herbal Teas &amp; Other Garden Tinctures",
      "is_published": true,
      "image_url": "https://cdn.filestackcontent.com/4PhkBhwMS0q1e4yCkoVO"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "from": 1,
    "to": 5,
    "per_page": 20,
    "number_of_pages": 1
  }
}
```

## `/course/{course_id}`

```json
{
  "course": {
    "id": 2002431,
    "description": null,
    "name": "Mushroom Madness",
    "heading": "Unlock the Secrets of Mushroom Foraging with Mushroom Madness",
    "is_published": true,
    "image_url": "https://cdn.filestackcontent.com/MKdUddC0R9iLDP27yF1L",
    "lecture_sections": [
      {
        "id": 8553537,
        "name": "First Section",
        "is_published": true,
        "position": 1,
        "lectures": [
          {
            "id": 45223462,
            "position": 1,
            "is_published": false
          }
        ]
      }
    ],
    "author_bio": {
      "profile_image_url": "https://www.filepicker.io/api/file/fVtArjCbSFSNMc2oCZgK",
      "bio": null,
      "name": "Ms. Frizzle",
      "user_id": 88958558
    }
  }
}
```

## `/courses/{course_id}/enrollments`

```json
{
  "enrollments": [
    {
      "user_id": 108775125,
      "enrolled_at": "2024-07-25T14:18:59Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 108775122,
      "enrolled_at": "2024-07-25T14:18:59Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 108775121,
      "enrolled_at": "2024-07-25T14:18:58Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 88958558,
      "enrolled_at": "2024-04-03T23:22:02Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 89125316,
      "enrolled_at": "2023-08-03T05:22:07Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 89125313,
      "enrolled_at": "2023-01-27T16:41:35Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 89125314,
      "enrolled_at": "2023-01-27T16:41:35Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 89125160,
      "enrolled_at": "2023-01-27T16:41:35Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 89125159,
      "enrolled_at": "2023-01-27T16:41:35Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 89125157,
      "enrolled_at": "2023-01-27T16:41:35Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    },
    {
      "user_id": 89125156,
      "enrolled_at": "2023-01-27T16:41:35Z",
      "completed_at": null,
      "percent_complete": 0,
      "expires_at": null
    }
  ],
  "meta": {
    "total": 11,
    "page": 1,
    "from": 1,
    "to": 11,
    "per_page": 0,
    "number_of_pages": 1
  }
}
```

## `/users`

```json
{
  "users": [
    {
      "email": "kristin.moser@teachable.com",
      "name": "Ms. Frizzle",
      "id": 88958558
    },
    {
      "email": "valeriefrizzle@test.com",
      "name": "Valerie Frizzle",
      "id": 89125156
    },
    {
      "email": "wandali@test.com",
      "name": "Wanda Li",
      "id": 89125157
    },
    {
      "email": "mrtoad@test.com",
      "name": "Mr. Toad",
      "id": 89125158
    },
    {
      "email": "mrfrog@test.com",
      "name": "Mr. Frog",
      "id": 89125159
    },
    {
      "email": "arnoldperlstein@test.com",
      "name": "Arnold Perlstein",
      "id": 89125160
    },
    {
      "email": "keeshafranklin@test.com",
      "name": "Keesha Franklin",
      "id": 89125313
    },
    {
      "email": "carlosramon@test.com",
      "name": "Carlos Ramón",
      "id": 89125314
    },
    {
      "email": "timwright@test.com",
      "name": "Tim Wright",
      "id": 89125315
    },
    {
      "email": "jyotikaur@test.com",
      "name": "Jyoti Kaur",
      "id": 89125316
    },
    {
      "email": "phoebeterese@test.com",
      "name": "Phoebe Terese",
      "id": 89126037
    },
    {
      "email": "meredith.marks@teachable.com",
      "name": "Meredith Marks",
      "id": 89126347
    },
    {
      "email": "dylan-cruz@live.com",
      "name": "dylan",
      "id": 104683905
    },
    {
      "email": "hua.alvin@test.com",
      "name": "Hua Alvin",
      "id": 108774922
    },
    {
      "email": "luna.june@test.com",
      "name": "Luna June",
      "id": 108774923
    },
    {
      "email": "c.shreya@test.com",
      "name": "Claudette Shreya",
      "id": 108774924
    },
    {
      "email": "anjali.beverly@test.com",
      "name": "Anjali Beverly",
      "id": 108774925
    },
    {
      "email": "edgar.xiangning@test.com",
      "name": "Edgar Xiangning",
      "id": 108774926
    },
    {
      "email": "greny.jakob@test.com",
      "name": "Greny Jakob",
      "id": 108775060
    },
    {
      "email": "sanghan.delsy@test.com",
      "name": "Sanghan Delsy",
      "id": 108775061
    }
  ],
  "meta": {
    "page": 1,
    "total": 32,
    "number_of_pages": 2,
    "from": 1,
    "to": 20,
    "per_page": 20
  }
}
```

## `/users/{user_id}`

```json
{
  "email": "valeriefrizzle@test.com",
  "name": "Valerie Frizzle",
  "src": null,
  "role": "student",
  "last_sign_in_ip": null,
  "id": 89125156,
  "courses": [
    {
      "course_id": 2002430,
      "course_name": "Trees and Arboreous Concerns",
      "enrolled_at": "2023-01-27T16:35:41Z",
      "is_active_enrollment": true,
      "completed_at": null,
      "percent_complete": 0
    },
    {
      "course_id": 2002431,
      "course_name": "Mushroom Madness",
      "enrolled_at": "2023-01-27T16:41:35Z",
      "is_active_enrollment": true,
      "completed_at": null,
      "percent_complete": 0
    },
    {
      "course_id": 2002436,
      "course_name": "Herbal Teas & Other Garden Tinctures",
      "enrolled_at": "2024-04-04T22:11:32Z",
      "is_active_enrollment": true,
      "completed_at": null,
      "percent_complete": 0
    }
  ],
  "tags": []
}
```
