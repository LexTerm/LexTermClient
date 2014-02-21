Ltm.LinkTableCellView = Ember.Table.TableCell.extend({
  templateName: 'link_table_cell',
  destination: function(){
    var column = this.get('column'),
        row    = this.get('row');
    if (column && row) {
      var content = this.get('cellContent');
      console.log(content);
      return content.destination;
    } else {
      //default to entry
      return 'entry';
    }
  }.property('column', 'row', 'cellContent'),

  instance: function(){
    var column = this.get('column'),
        row    = this.get('row');
    if (column && row) {
      var content = this.get('cellContent');
      return content.instance;
    } else {
      return;
    }

  }.property('column', 'row', 'cellContent'),

  inner: function(){
    var column = this.get('column'),
        row    = this.get('row');
    if (column && row) {
      var content = this.get('cellContent');
      console.log(content);
      return content.inner;
    } else {
      return 'Loading...';
    }
  }.property('column', 'row', 'cellContent')

});
