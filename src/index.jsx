// index.jsx
//  Program entry.

'use strict';
// ============================================
// React packages
import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
// import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
// import blue from 'material-ui/colors/blue';

// ============================================
// import react components
import Main from 'components/Main.jsx';

// ============================================
// import react redux-reducers
import {main} from 'states/mainState.js';
import {setting} from 'states/settingState.js';

// ============================================
// import apis

// ============================================
// import css file
// import '../node_modules/bootstrap/dist/css/bootstrap.css';

// ============================================
// load component
window.onload = function() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(combineReducers({
    main, setting
  }), composeEnhancers(applyMiddleware(thunkMiddleware)));

  // customize global material theme
  // const theme = createMuiTheme({
  //   palette: {
  //     primary: blue
  //   }
  // });

  ReactDOM.render(
    <Provider store={store}>
      {/* <MuiThemeProvider theme={theme}> */}
        <Main />
      {/* </MuiThemeProvider> */}
    </Provider>,
    document.getElementById('root')
  );
};

// load hypermd
// Does anyone have a better method @@
require('codemirror/lib/codemirror');
require('hypermd/core');
require('hypermd/mode/hypermd');
require('hypermd/addon/hide-token');
require('hypermd/addon/cursor-debounce');
require('hypermd/addon/fold');
require('hypermd/addon/fold-link');
require('hypermd/addon/fold-image');
require('hypermd/addon/fold-math');
require('hypermd/addon/fold-html');
require('hypermd/addon/fold-emoji');
require('hypermd/addon/read-link');
require('hypermd/addon/click');
require('hypermd/addon/hover');
require('hypermd/addon/paste');
require('hypermd/addon/insert-file');
require('hypermd/addon/mode-loader');
require('hypermd/addon/table-align');
require('hypermd/keymap/hypermd');
require('hypermd/powerpack/fold-emoji-with-emojione');
require('hypermd/powerpack/insert-file-with-smms');
require('hypermd/powerpack/hover-with-marked');
require('hypermd/powerpack/fold-math-with-katex');
require('hypermd/powerpack/paste-with-turndown');
require('turndown-plugin-gfm');
require('codemirror/mode/apl/apl.js');
require('codemirror/mode/asciiarmor/asciiarmor.js');
require('codemirror/mode/asn.1/asn.1.js');
require('codemirror/mode/asterisk/asterisk.js');
require('codemirror/mode/brainfuck/brainfuck.js');
require('codemirror/mode/clike/clike.js');
require('codemirror/mode/clojure/clojure.js');
require('codemirror/mode/cmake/cmake.js');
require('codemirror/mode/cobol/cobol.js');
require('codemirror/mode/coffeescript/coffeescript.js');
require('codemirror/mode/commonlisp/commonlisp.js');
require('codemirror/mode/crystal/crystal.js');
require('codemirror/mode/css/css.js');
require('codemirror/mode/cypher/cypher.js');
require('codemirror/mode/d/d.js');
require('codemirror/mode/dart/dart.js');
require('codemirror/mode/diff/diff.js');
require('codemirror/mode/django/django.js');
require('codemirror/mode/dockerfile/dockerfile.js');
require('codemirror/mode/dtd/dtd.js');
require('codemirror/mode/dylan/dylan.js');
require('codemirror/mode/ebnf/ebnf.js');
require('codemirror/mode/ecl/ecl.js');
require('codemirror/mode/eiffel/eiffel.js');
require('codemirror/mode/elm/elm.js');
require('codemirror/mode/erlang/erlang.js');
require('codemirror/mode/factor/factor.js');
require('codemirror/mode/fcl/fcl.js');
require('codemirror/mode/forth/forth.js');
require('codemirror/mode/fortran/fortran.js');
require('codemirror/mode/gas/gas.js');
require('codemirror/mode/gfm/gfm.js');
require('codemirror/mode/gherkin/gherkin.js');
require('codemirror/mode/go/go.js');
require('codemirror/mode/groovy/groovy.js');
require('codemirror/mode/haml/haml.js');
require('codemirror/mode/handlebars/handlebars.js');
require('codemirror/mode/haskell-literate/haskell-literate.js');
require('codemirror/mode/haskell/haskell.js');
require('codemirror/mode/haxe/haxe.js');
require('codemirror/mode/htmlembedded/htmlembedded.js');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/mode/http/http.js');
require('codemirror/mode/idl/idl.js');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/jinja2/jinja2.js');
require('codemirror/mode/jsx/jsx.js');
require('codemirror/mode/julia/julia.js');
require('codemirror/mode/livescript/livescript.js');
require('codemirror/mode/lua/lua.js');
require('codemirror/mode/markdown/markdown.js');
require('codemirror/mode/mathematica/mathematica.js');
require('codemirror/mode/mbox/mbox.js');
require('codemirror/mode/mirc/mirc.js');
require('codemirror/mode/mllike/mllike.js');
require('codemirror/mode/modelica/modelica.js');
require('codemirror/mode/mscgen/mscgen.js');
require('codemirror/mode/mumps/mumps.js');
require('codemirror/mode/nginx/nginx.js');
require('codemirror/mode/nsis/nsis.js');
require('codemirror/mode/ntriples/ntriples.js');
require('codemirror/mode/octave/octave.js');
require('codemirror/mode/oz/oz.js');
require('codemirror/mode/pascal/pascal.js');
require('codemirror/mode/pegjs/pegjs.js');
require('codemirror/mode/perl/perl.js');
require('codemirror/mode/php/php.js');
require('codemirror/mode/pig/pig.js');
require('codemirror/mode/powershell/powershell.js');
require('codemirror/mode/properties/properties.js');
require('codemirror/mode/protobuf/protobuf.js');
require('codemirror/mode/pug/pug.js');
require('codemirror/mode/puppet/puppet.js');
require('codemirror/mode/python/python.js');
require('codemirror/mode/q/q.js');
require('codemirror/mode/r/r.js');
require('codemirror/mode/rpm/rpm.js');
require('codemirror/mode/rst/rst.js');
require('codemirror/mode/ruby/ruby.js');
require('codemirror/mode/rust/rust.js');
require('codemirror/mode/sas/sas.js');
require('codemirror/mode/sass/sass.js');
require('codemirror/mode/scheme/scheme.js');
require('codemirror/mode/shell/shell.js');
require('codemirror/mode/sieve/sieve.js');
require('codemirror/mode/slim/slim.js');
require('codemirror/mode/smalltalk/smalltalk.js');
require('codemirror/mode/smarty/smarty.js');
require('codemirror/mode/solr/solr.js');
require('codemirror/mode/soy/soy.js');
require('codemirror/mode/sparql/sparql.js');
require('codemirror/mode/spreadsheet/spreadsheet.js');
require('codemirror/mode/sql/sql.js');
require('codemirror/mode/stex/stex.js');
require('codemirror/mode/stylus/stylus.js');
require('codemirror/mode/swift/swift.js');
require('codemirror/mode/tcl/tcl.js');
require('codemirror/mode/textile/textile.js');
require('codemirror/mode/tiddlywiki/tiddlywiki.js');
require('codemirror/mode/tiki/tiki.js');
require('codemirror/mode/toml/toml.js');
require('codemirror/mode/tornado/tornado.js');
require('codemirror/mode/troff/troff.js');
require('codemirror/mode/ttcn-cfg/ttcn-cfg.js');
require('codemirror/mode/ttcn/ttcn.js');
require('codemirror/mode/turtle/turtle.js');
require('codemirror/mode/twig/twig.js');
require('codemirror/mode/vb/vb.js');
require('codemirror/mode/vbscript/vbscript.js');
require('codemirror/mode/velocity/velocity.js');
require('codemirror/mode/verilog/verilog.js');
require('codemirror/mode/vhdl/vhdl.js');
require('codemirror/mode/vue/vue.js');
require('codemirror/mode/webidl/webidl.js');
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/xquery/xquery.js');
require('codemirror/mode/yacas/yacas.js');
require('codemirror/mode/yaml-frontmatter/yaml-frontmatter.js');
require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/z80/z80.js');
