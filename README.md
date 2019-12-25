# Expanse Api

Expanse Api keep the track of your expanses. You can share with expanse with your friends and keep record of payments.

### Deployment Instruction.

> `docker-compose up` To start the mysql server. If you want to change the mysql config you can do you on `src/db/config/config.json`

> `npm run start` 

>  Naviagte to `http://localhost:3000/graphql`

## Technology Stack
Hapi + Apollo + GraphQl

Sequelize https://sequelize.org/ ORM

Casbin https://github.com/casbin/casbin for RBAC

GraphQl-Shield https://github.com/maticzav/graphql-shield


## GraphQL Docs

### Create User


```graphql
mutation{
  createUser(input:{
    firstName:"yourName",
    lastName:"yourtLasName",
    age:20,
    email:"yourEmail@gmail.com",
    password:"yourPassword",
    country:"yourCountry",
  }){
    id
  }
}
```
### List Users

```graphql
query{
  users{
    id
    firstName
    lastname
    email
  }
}
```

### Login

```graphql
mutation{
  login(email:"aslam@gmail.com",password:"124"){
    token,
    user{
      id
    }
  }
}
```

### Create Ratio

> `a` define amount of ratio for person 1

> `b` define amount of ratio for person 2
```graphql
mutation{
  createRatio(input:{
    name:"5050"
    description:"Equal Share"
    a:50 
    b:50
  }){
    id
  }
}
```

### List Ratios

```graphql
query{
  ratios{
    id
    name
    description
    a
    b
  }
}
```


### Create Expanse
> `rationId` requried the `id` of the `Ratio` at which you want to share your expanse. Query `ratios` to view the available `id`.  

> `shares_with` required the `id` of your friend (`User`) with whom you want to share the expanse. Query `users` to view the available `user` with whom you can share.

```graphql
mutation{
  createExpanses(input:{
    name:"yourExpanseName",
    description:"yourExpanseDescription",
    total_amount:3850,
    ratioId:1,
    shares_with:[
      3
    ]
  }){
    id
  }
}
```


### List Expanse

```graphql
query{
  expanses{
    id
    name
    description
    ratio{
      name
    }
    user{
      id
      email
    }
    expansesShare{
      amount
      status
      id
      user{
        email
      }
      payment{
        amount
      }
    }
  }
}
```


### Get Expanse

```graphql
query{
  expanse(id:yourExpanseid){
    id
    name
    description
    ratio{
      name
    }
    user{
      id
      email
    }
    expansesShare{
      amount
      status
      id
      user{
        email
      }
      payment{
        amount
      }
    }
  }
}
```



### Balance

```graphql
query{
  balance{
    receivable
    paid
    received
  }
}
```
### ExpansesShares

```graphql
query{
  expansesShares(status:Pending){
    id
    amount
    status
    payment{
      amount
    }
    expanse{
      name
      total_amount
      user{
        email
      }
    }
    user{
      id
    }
  }
}
```

### Create Payments
> `expansesshareId` required to make the payment. Query `expanses` to get  `expansesshareId`.
```graphql
mutation{
  createPayment(input:{
    description:"yourDescription"
    amount:780,
    expansesshareId:32
  }){
    id
    description
  }
}
```


### List Payments

```graphql
query{
  payments{
    id,
    amount,
    user{
      id,
      email
    }
    description
    expansesShare{
      id
      amount
      status
      expanse{
        name
        description
        ratio{
          name
        }
        user{
          email
        }
      }
    }
  }
}
```


### Get Payments

```graphql
query{
  payment(id:yourID){
    id,
    amount,
    user{
      id,
      email
    }
    description
    expansesShare{
      id
      amount
      status
      expanse{
        name
        description
        ratio{
          name
        }
        user{
          email
        }
      }
    }
  }
}
```