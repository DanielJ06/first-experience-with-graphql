const express = require('express');
const expressGraphql = require('express-graphql');
const { 
	GraphQLSchema, 
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInt,
} = require('graphql');

const app = express();

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType = new GraphQLObjectType({
	name: 'Book',
	description: 'This represents a book',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLInt) },
		name: { type: GraphQLNonNull(GraphQLString) },
		authorId: { type: GraphQLNonNull(GraphQLInt) },
		author: { type: AuthorType, resolve: (book) => {
			return authors.find(author => author.id === book.authorId)
		}}
	})
});

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	description: 'This represents a author',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLInt) },
		name: { type: GraphQLNonNull(GraphQLString) },
		books: {
			type: new GraphQLList(BookType),
			resolve: (author) => {
				return books.filter(book => book.authorId === author.id);
			}
		}
	})
});

const RootQueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: () => ({
		books: {
			type: new GraphQLList(BookType),
			description: 'List of books',
			resolve: () => books
		},

		book: {
			type: BookType,
			description: 'List a single book',
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (params, args) => {
				return books.find(book => book.id === args.id)
			}
		},

		authors: {
			type: new GraphQLList(AuthorType),
			description: 'List of authors',
			resolve: () => authors
		},

		author: {
			type: AuthorType,
			description: 'List a single author',
			args: {
				id: { type: GraphQLInt }
			},
			resolve: (params, args) => {
				return authors.find(author => author.id === args.id)
			}
		}
	})
});

const schema = new GraphQLSchema({
	query: RootQueryType,
});

app.use('/graphql', expressGraphql({
	schema: schema,
	graphiql: true,
}));

app.listen(3000, () => console.log('Running...'));
