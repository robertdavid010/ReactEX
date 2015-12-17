var TodoApp = React.createClass({
	
	getInitialState: function () {
		// Initialize items
		return {items: []};
	},

	addItem: function (text, column, query) {
		// Create object with passed params
		var newItem = {text: text, column: column};

		// Add object to the beginning of items array
		var allItems = this.state.items;
		allItems.unshift(newItem);

		// Update the current state of this component
		this.setState({items: allItems});
	},

	getIndex: function (str, arr) {
		// Helper function to return index of element
		for (var i in arr) {
			var curr = arr[i];
			if (curr.text == str) {
				return i;
			};
		};
		// Return negative if not found
		return -1;
	},

	removeItem: function (event) {
		// Remove todo item after clicking remove button
		// NOTE: does not support duplicates.
		// Assumed unique keys in production
		var text = event.target.dataset.item;

		// Find the index of the todo item in the list
		var itemArray = this.state.items;
		var filterArray = this.state.results;
		var itemIndex = this.getIndex(text, itemArray);
		var filterIndex = this.getIndex(text, filterArray);

		// Remove list items from arrays
		itemArray.splice(itemIndex, 1);
		filterArray.splice(filterIndex, 1);

		// Update component state
		this.setState({items: itemArray});
		this.setState({results: filterArray});

	},

	filterItems: function (query) {
		// Get the items to filter
		var listItems = this.state.items;

		// Filter items based on supplied query
		var queriedItems = listItems.filter(function (obj) {

			var str = obj.text;
			var res = str.search(query);
			return (res!=-1) ? true : false;

		});

		// Set results to component results state
		this.setState({results: queriedItems});
	},

	render: function () {

		// Display filtered items if there are results
		// TODO: Initialize the this.state.results instead
		var rslt = this.state.results;
		var items = (rslt === undefined) ? this.state.items : rslt;

		// Render the main DOM structure and components
		return (
			<div className="row">
				<div className="col-md-4 rdm-form-col">

					<AddTodo onFormSubmit={this.addItem} onQueryUpdate={this.filterItems} />
					<div className="rdm-bottom-spacer"></div>
				</div> 
				<div className="col-md-8">
					<div className="row rdm-list-row">
						<div className="col-md-6 rdm-list-col">
							<h4 className="rdm-list-header">Column 1</h4>
							<ListItems items={items} column={'1'} onClickRemove={this.removeItem} />

						</div> 
						<div className="col-md-6 rdm-list-col">

							<h4 className="rdm-list-header">Column 2</h4>
							<ListItems items={items} column={'2'} onClickRemove={this.removeItem} />

						</div> 
					</div>
				</div>
			</div> 
		);
	}

});

var ListItems = React.createClass({

	createItem: function (item) {
		// Generate the list item
		return (
			<li className="list-group-item" key={item.text}>{item.text}
				<span className="close" key={item.text} data-item={item.text} onClick={this.props.onClickRemove}>&times;
				</span>
			</li>
		);
	},

	render: function () {
		// Filter items for column display
		var showCol = this.props.column;
		var theItems = this.props.items;

		var filteredItems = theItems.filter(function (obj) {
			return obj.column == showCol;
		});

		return <ul className="list-group">{filteredItems.map(this.createItem)}</ul>;
	}
});

var AddTodo = React.createClass({

	handleSubmit: function (event) {
		// Handler for form submit
		event.preventDefault();

		// Parse data passed by form
		var fieldValue = event.target.itemText.value;
		var selectValue = event.target.columnNum.value;
		var queryValue = event.target.searchQuery.value;

		// Update item list if results returned
		if (selectValue != "choose" && fieldValue) {
			this.props.onFormSubmit(fieldValue, selectValue, queryValue);
		};

		// Clear form for new input
		event.target.itemText.value = "";

		// Update filtered results to include new items
		this.props.onQueryUpdate(queryValue);

	},

	handleChange: function (event) {
		// Update filtered list based on query while typing
		var query = event.target.value;
		this.props.onQueryUpdate(query);
	},

	render: function () {
		// Render main form elements
		return (
			<form id="rdm-add-item-form" onSubmit={this.handleSubmit}>
				<input className="form-control" type="text" name="itemText" placeholder="Enter Item" />
				<select name="columnNum" className="form-control" defaultValue="choose">
					<option value="choose" disabled>Choose Column</option>
					<option value="1">Column 1</option>
					<option value="2">Column 2</option>
				</select>
				<button className="btn form-control btn-default" type="submit" name="submit">Add Item</button>
				<label htmlFor="search-query">Search an item</label>
				<input id="search-query" name="searchQuery" className="form-control" type="text" placeholder="Search" onChange={this.handleChange}/>
			</form>
		);
	}
});

ReactDOM.render(
	<TodoApp />,
	document.getElementById('TodoApp')
);
