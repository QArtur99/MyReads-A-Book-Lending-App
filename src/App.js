import React from 'react'
import './App.css'
import {Route} from 'react-router-dom'
import ListBooks from './ListBooks'
import Book from './Book'
import {Link} from 'react-router-dom'
import {getAll, update, search} from './BooksAPI';


class BooksApp extends React.Component {

    state = {
        /**
         * TODO: Instead of using this state variable to keep track of which page
         * we're on, use the URL in the browser's address bar. This will ensure that
         * users can use the browser's back and forward buttons to navigate between
         * pages, as well as provide a good URL they can bookmark and share.
         */
        books: [],
        booksTemp: [],
        query: '',
        showSearchPage: false
    };


    componentDidMount() {
        if (!window.location.href.includes('search')) {
            getAll().then((books) => {
                this.setState({books})
            })
        }
    }

    reload() {
        getAll().then((books) => {
            this.setState({books: books})
        })
    }

    updateBook(book, option) {
        update(book, option).then((books) => {
            this.componentDidMount()
        });
    }

    checkKey(mapOfBooks, book){
        if(mapOfBooks.has(book.id)) {
            mapOfBooks.set(book.id, book)
        }
    }

    compareBooks(bookTemps, books){
        let mapOfBooks = new Map();
        books.map((book) => mapOfBooks.set(book.id, book));
        bookTemps.map((book) => this.checkKey(mapOfBooks, book));
        let tempArray = [];
        Array.from(mapOfBooks.keys()).map((key) => tempArray.push(mapOfBooks.get(key)));
        this.setState({books: tempArray});
    }

    updateQuery(query) {
        this.setState({
            query: query.trim()
        });
        search(query).then((books) => {
            if (books !== undefined && books.constructor === Array) {
                this.compareBooks(this.state.booksTemp, books);
            } else {
                this.setState({books: []});
            }
        });
    }

    render() {
        return (
            <div className="app">
                <Route path='/search' render={({history}) => (
                    <div className="search-books">
                        <div className="search-books-bar">
                            <Link className='close-search' to='/'
                                  onClick={() => this.reload()}>Close</Link>
                            <div className="search-books-input-wrapper">
                                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                                <input className='search-contacts'
                                       type='text'
                                       placeholder="Search by title or author"
                                       value={this.state.query}
                                       onChange={(event) => this.updateQuery(event.target.value)}/>
                            </div>
                        </div>
                        <div className="search-books-results">
                            <ol className='books-grid'>
                                {this.state.books.map((book) => (
                                    <Book book={book} parent={this} history={history}/>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}/>
                <Route exact path='/' render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Currently Reading</h2>
                                    <div className="bookshelf-books">
                                        <ListBooks books={this.state.books} shelf={"currentlyReading"}
                                                   parent={this}/>
                                    </div>
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Want to Read</h2>
                                    <div className="bookshelf-books">
                                        <ListBooks books={this.state.books} shelf={"wantToRead"} parent={this}/>
                                    </div>
                                </div>
                                <div className="bookshelf">
                                    <h2 className="bookshelf-title">Read</h2>
                                    <div className="bookshelf-books">
                                        <ListBooks books={this.state.books} shelf={"read"} parent={this}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="open-search">
                            <Link to='/search' className='search-books'
                                  onClick={() => this.setState({booksTemp: this.state.books, books: [], query: ''})}>Add a book</Link>
                        </div>
                    </div>
                )}/>
            </div>
        )
    }
}

export default BooksApp
