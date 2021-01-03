const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// Some fake data
const authors = [
  {
    id: "1",
    info: {
      name: "Joe Kelly",
      age: 32,
      gender: "M",
    }
  },
  {
    id: "2",
    info: {
      name: "Mary Jane",
      age: 27,
      gender: "F",
    }
  }
];

// The GraphQL schema in string form
const typeDefs = `
type Author {
	id: ID!
	info: Person
}
type Person {
	name: String!
	age: Int
	gender: String
}
type Query {
  getAuthors: [Author]
  retrieveAuthor(id: ID!): Author
}
type DeleteMessage {
  id: ID!,
  message: String
}
type Mutation {
  createAuthor(name: String!, gender: String!) : Author
  updateAuthor(id: ID!, name: String, gender: String, age: Int): Author
  deleteAuthor(id:ID!): DeleteMessage
}
`;

// The resolvers
const resolvers = {
  Query: {
    getAuthors: () => authors,
    retrieveAuthor: (obj, { id }) => authors.find(author => author.id === id)
  },
  Mutation: {
    createAuthor: (obj, args) => {
      const id = String(authors.length + 1);
      const { name, gender } = args;
      const newAuthor = {
        id,
        info: {
          name,
          gender
        }
      }
      authors.push(newAuthor);
      return newAuthor;
    },
    updateAuthor: (obj, { id, name, gender, age }) => {
      const author = authors.find(author => author.id === id);
      if (author) {
        const authorIndex = authors.indexOf(author);
        if (name) author.name = name;
        if (gender) author.gender = gender;
        if (age) author.age = age;
        authors[authorIndex] = { id, info: author }; // Update author using index
        return { id, info: author };
      } else {
        throw new Error('Author ID not found');
      }
    },
    deleteAuthor: (obj, { id, name, gender, age }) => {
      const author = authors.find(author => author.id === id);
      if (author) {
        const authorIndex = authors.indexOf(author);
        authors.splice(authorIndex, 1);
        return { id, message: `Author with Id ${id} deleted successfully` }
      } else {
        throw new Error('Author ID not found');
      }
    }
  }
};

const PORT = 3600;

// Put together a schema
const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

server.applyMiddleware({ 
  app,
  path: '/graphql'
});


app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
