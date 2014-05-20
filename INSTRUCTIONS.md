<a name="translators"></a>
Terminologists
-----------
If you have terminology that hasn't been integrated into the LexTerm Manager,
 you can import the terminology by following the instructions for [importing an existing TBX termbase] (#tbx) or
[manually creating entries](#help-new-entry). Once your terminology has been entered in the manager, you can access the data by
 clicking on the "Terminology" link in the top navigation bar to navigate to the [terminology perspective](#term).

The [terminology perspective](#term) allows you to view terms across multiple languages. You can also search for
specific terms using the search box in the top left. Terms are ordered by their concept id. If you want to add
a new term to a concept, copy the concept id for the concept you wish to extend, then click "New Entry" to [create
a new entry](#help-new-entry) with that concept in another language.


<a name="translators"></a>
Lexicographers
-----------
If TBX files are available, they can be a good way to [bootstrap the lexicon](#tbx). Sadly there is not as yet
any import functionality for LMF formats. However, you can [create new entries](#help-new-entry) and [expand the
paradigms for existing entries](#edit-entry) manually. To lookup an entry, use the [lexicon perspective](#lex).
The [lexicon perspective](#lex) has a search box in the top left corner. This searchbox will filter entries
to only those that have a written representation of a form that matches the query. For example, searching for "cats"
with match entries with the lemma "cat" so long as there is a form with a value "cats" for that entry. Click on the
title of the entry to edit that entry.


<a name="translators"></a>
Translators
-----------
If you have terminology that hasn't been integrated into the LexTerm Manager,
 you can import the terminology by following the instructions for [importing an existing TBX termbase] (#tbx) or
manually creating entries. Once your terminology has been entered in the manager, you can access the data by
 clicking on the "Terminology" link in the top navigation bar to navigate to the [terminology perspective](#term).

The [terminology perspective](#term) allows you to view terms and definitions for multiple languages, which is
useful as a basic glossary while translating. You can use the search box in the top left to search for various
entries. The search box will find entries that have a representation matching the query even if that representation
is not the lemma, which means that terms returned may not appear to match the query. However, if you click on a
highlighted term, you will be able to view the full paradigm for that term.


<a name="tbx"></a>
Importing an existing TBX termbase
-----------
1. Click "TBX" in the top navigation bar.
2. Click "Upload" to upload your TBX file.
3. Be patient during the upload, you will be redirected when the upload completes successfully.

*Note: the LexTerm Manager only supports properly formated TBX-Basic files.*
### Warning: Termbases larger than 1mb will take very long to process and may not complete on some servers.


<a name="help-new-entry"></a>
Creating New Entries
-----------
To add a new entry to the LexTerm Manager, click the "New Entry" link in the top navigation bar. Each new entry
requires a lemma, which is the primary written representation of a term if you are using the LexTerm Manager
for terminology. You may also provide a custom Lexical ID for the entry to reference exising sources of
terminology or lexicographic data. If you do not provide a Lexical ID, the system will generate one for you.

All entries require a reference to both a language and a concept. An entry is in essence the manifestation of
a particular concept in a particular language.

If the entry is for an existing language, click the button labeled "Language" to select a langauge from the
dropdown. Otherwise, you can create a new language by clicking the "+" symbol. This will bring up a New Language
dialog with fields for the language name, code, and region code. Every language requires a name, which is the
display name of the language (e.g. English). Every language also requires a language code, which can be up to
four characters long depending on the part of ISO 639 you wish to use to categorize languages. You may also
specify the language as a regional dialect by providing a region code. Click "Save" to save the new language.
This will make it available in the Entry language dropdown list.

If the entry is for an existing concept, click the button labeled "Concept" to select a concept from the dropdown.
Otherwise, you can create a new concept by clicking the "+" symbol. This will bring up a New Concept dialog. A
concept consists of a unique concept id. If you do not know the id of the concept that the entry belongs to,
you can click save and have the LexTerm Manager generate a unique concept id for you.

Once you have filled out the various fields, click the "Save" button to create the new entry. Because the entry
and all of its various parts will need to be indexed in the search system, it may take several seconds before
you will be automatically navigated to the entry perspective, where you can provide additional information about
this entry.


<a name="edit-entry"></a>
Editing Existing Entries
-----------
All of the various parts of a LexTerm Manager entry can be edited by clicking on an entry link in either the
[terminology](#term) or [lexicon](#lex) perspectives. Once opened, an entry will display the lemma at the top.
Clicking on the "X" in the top right will delete the entry. This does not delete any languages, lexical classes,
forms, features, concepts, or subject fields related to that entry. However, it will remove any representations
of any forms that comprise the entry. In general, it is not possible to delete other parts of an entry via the
LexTerm Manager client.

Clicking on the "+" symbol will open a dialog to create new Language, Lexical Class (Part of Speech), Concept,
 etc. For example, if no subject fields exist, clicking the "+" next to "Subject Fields" will open a dialog to
create a new subject field. After saving the subject field, you can add the subject field to the entry by clicking
the "Add Subject Field" button, which displays a dropdown list of available subject fields (*warning this list
is loaded dynamically from the server so it make take a second or two to populate.*)

The "\*" symbol is a placeholder. It indicates that the corresponding part of the entry was generated automatically.
For example, if the entry was added via a TBX upload, the system will automatically create a "\*" lexical class
when no Part of Speech information is provided. Also, each entry starts with a "\*" form for the lemma. You
will need to fill out the lexicographic information (paradigm) for each entry after it is created.

To expand the paradigm for each entry, you need to ensure that the relevant forms and features exist. To add
new forms and features, simply click the "+" symbol to open a creation dialog. Forms do not require features,
but it is not currently possible to add features to an existing form in the LexTerm manager client. Therefore,
 it is generally best to
create the necessary features before creating a form. The feature creation dialog has create-select widgets
that allow you to either select an existing feature type / feature value or create a new one by typing the
name of the feature type / feature value and hitting \<Enter\>. For example, you could select the feature
type "Number", assuming that it has been created, and then type "plural" to add the feature type "plural". Then,
click save to save this new feature combination. Following the same example, you might create a form with
the name "noun-plural" to be used with nouns that have a number feature by entering the name "noun-plural"
in the new form dialog field "Name" and selecting the plural feature in the multiselect on the same dialog.
To add this new form to the entry, click the "Add Lexical Form" button and select the noun-plural form.
This will add a new row to the paradigm with a placeholder (i.e. "\*") for the written representation of that
form. You can then fill in the written representation of the form and hit \<Enter\> to save it in the paradigm.
Assuming you were working on an entry for the term "cat" in English, the written representation of the
noun-plural form would be "cats".

*Note: To save most parts of the entry, simply hit \<Enter\>. Selections are automatically saved.
 In order to save a definition, you must hit \<Enter\> while the cursor is inside the definition.*

*Note: For developers --- All data on the server may be created, retrieved, updated, and deleted via the
RESTful API, which has a human readable browseable interface accessible under [/api](/api).*



<a name="term"></a>
Terminology Perspective
-----------
In order to view the terminology perspective, there must be entries for the LexTerm Manager to access. If the
"Terminology" link does not appear in the top navigation bar, you need to either [manually create entries](#help-new-entry)
 or [import an existing TBX termbase](#tbx) to proceed. Once data has been entered the terminology perspective
becomes available by clicking the "Terminology" link in the top navigation bar.

The terminology perspective consists of a table of concepts and their representations (i.e. terms) in selected
languages. To select a language to view, simply click the box under "Languages" and select a language by name
from the dropdown menu. You can also filter concepts by subject field if subject fields have been assigned
to concepts ([see editing existing entries](#edit-entry)).

To deselect a language or subject field, simply click the "X" on the language name tag.

Results can be paginated using the pager at the bottom of the terminology perspective. The left-hand side of the
pager is for limiting the number of results in the table, and the right-hand side is for cycling through pages
of data when the LexTerm Manager has more entries that match the languages and subject fields selected than the
limit.

Clicking on individual terms will navigate to that entries page where you can view lexicographic data about that
particular term.


<a name="lex"></a>
Lexicon Perspective
-----------
In order to view the lexicon perspective, there must be entries for the LexTerm Manager to access. If the
"Lexicon" link does not appear in the top navigation bar, you need to either [manually create entries](#help-new-entry)
 or [import an existing TBX termbase](#tbx) to proceed. Once data has been entered the lexicon perspective
becomes available by clicking the "Lexicon" link in the top navigation bar.

The lexicon perspective consists of a panel for selecting various languages and a list of entries for the language
selected. Clicking on the highlighted title (lemma) for any given entry will allow you to edit that entry. Unlike
the [terminology perspective](#term), this perspective shows all of the data for a given entry but does not let
you compare concepts across languages.

Results can be paginated using the pager at the bottom of the lexicon perspective. The left-hand side of the
pager is for limiting the number of results in the table, and the right-hand side is for cycling through pages
of data when the LexTerm Manager has more entries that match the language selected than the limit.
