Ltm.EditableSelectComponent = Ember.Widgets.SelectComponent.extend({
  templateName: 'select',
  newClass: Ember.Object.extend(Ember.Copyable),
  queryPropertyName: 'name',
  filteredContent: Ember.computed(function() {
    var content, filteredContent, query,
      _this = this;
    content = this.get('content');
    query = this.get('query');
    if (!content) {
      return [];
    }
    filteredContent = this.get('content').filter(function(item) {
      return _this.matcher(query, item);
    });
    if (filteredContent.length === 0) {
      var proto = {};
      var key = this.get('queryPropertyName');
      proto[key] = query;
      proto.copy = function() {
        return proto;
      };
      var new_obj = this.get('newClass').create(proto);
      filteredContent = [new_obj];
    }
    if (!this.get('sortLabels')) {
      return filteredContent;
    }
    return _.sortBy(filteredContent, function(item) {
      var _ref;
      return (_ref = item.get(_this.get('optionLabelPath'))) !== null ? _ref.toLowerCase() : void 0;
    });
  }).property('content.@each', 'query', 'optionLabelPath', 'sortLabels'),
});
