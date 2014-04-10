Ltm.InnerTableCellView = Ember.Table.TableCell.extend({
  templateName: 'inner_table_cell',

  columns: function() {
    return [Ember.Table.ColumnDefinition.create({
      headerCellName: 'test',
      //contentPath: 'name'
      getCellContent: function(row) {
        console.log('calling getcell');
        console.log(row);
        return 'dude';
      }
    })];
  }.property('cellContent'),

  rows: function() {
    console.log(this.get('cellContent'));
    var out = [Ember.Object.create({
      name: this.get('cellContent')
    })];
    console.log(out);
    return out;
  }.property('cellContent')

});
