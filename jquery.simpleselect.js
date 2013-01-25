/*
 * jQuery Simple Select
 * http://pioul.fr/jquery-simpleselect
 *
 * Copyright 2013, Philippe Masset
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function($){
	$.fn.simpleselect = function(mixed){
	
		var t = $(this);
	
		// first plugin call
		if(typeof(mixed) == 'object' || !mixed){
		
			options = $.extend({}, { fadeSpeed: 0 }, mixed);
			
			t.each(function(){
				var t = $(this);
				t.addClass("simpleselected");
				// create the simpleselect
				var simpleselect = 	$('<div class="simpleselect"></div>'),
					simpleplaceholder = $('<div class="placeholder"></div>').appendTo(simpleselect);
				if(t.is("[id]")){
					simpleselect.attr("id", 'simpleselect_'+ t.attr("id"));
				}
				// simpleselect data
				var simpleselectdata = {
					ref: t,
					simpleselect: simpleselect,
					can_be_closed: true, // flag used to know when to (not) close the select
					set_active: function(){
						if(!this.simpleselect.is(".active") && !this.ref.prop("disabled")){
							this.last_value = this.ref.val();
							this.simpleselect.addClass("active");
							var option_to_activate = this.get_option_to_activate();
							this.set_option_active(option_to_activate);
							var simpleselectoptions = this.simpleselect.children(".options"),
								document_height = $(document).height();
							simpleselectoptions.fadeTo(0, 0);
							simpleselectoptions.fadeTo(options.fadeSpeed, 1);
							if(!this.ref.is(":focus")){
								this.ref.focus();
							}
							this.position_around_active_option(option_to_activate, document_height);
							this.simpleselect.hide().show(0); // force a redraw to avoid a bug found in Webkit
							$(document).bind("click.simpleselect", function(){
								var active_simpleselects = $(".simpleselect.active");
								active_simpleselects.each(function(){
									$(this).data("simpleselect").set_inactive();
								});
								$(document).unbind(".simpleselect");
							});
						}
					},
					set_inactive: function(){
						if(this.simpleselect.is(".active")){
							this.simpleselect
								.removeClass("active")
								.children(".options").fadeOut(options.fadeSpeed);
							if(this.ref.is(":focus")){
								this.ref.blur();
							}
							if(this.last_value != this.ref.val()){
								this.ref.trigger("change.simpleselect");
							}
						}
					},
					set_option_active: function(simpleoption){
						this.simpleselect.find(".option").removeClass("active");
						simpleoption.addClass("active");
					},
					get_option_to_activate: function(){
						var index_option = this.ref.data("simpleselectref").get_index_selected();
						return this.simpleselect.find(".option:eq("+ index_option +")");
					},
					get_option_active: function(){
						return this.simpleselect.find(".option.active");
					},
					choose_option: function(simpleoption){
						var select_options = this.ref.find("option"),
							target_option = select_options.filter(":eq("+ this.simpleselect.find(".options .option").index(simpleoption) +")"),
							target_option_index = select_options.index(target_option),
							target_value = target_option.val();
						this.ref.val(target_value);
						this.simpleselect.children(".placeholder").text(target_option.text());
					},
					position_around_active_option: function(simpleoption, document_height){
						var simpleoptions = this.simpleselect.children(".options");
						// get initial properties back
						simpleoptions.css({
							height: 'auto',
							'overflow-y': 'visible'
						});
						var simpleoptions_height = simpleoptions_future_height = simpleoptions.height(),
							pos = this.simpleselect.offset(),
							options_option_height = this.simpleselect.outerHeight(),
							optionpos = simpleoption.position(),
							free_space_top = pos.top,
							free_space_bot = document_height - pos.top - options_option_height,
							options_max_height = (free_space_top < free_space_bot)? free_space_top : free_space_bot,
							options_max_height_window = ($(window).height() - options_option_height) / 2;
						options_max_height = (options_max_height_window < options_max_height)? options_max_height_window : options_max_height;
						// if .options maybe needs a scrollbar
						var scrollable = false;
						if(options_max_height < simpleoptions_height){
							var simpleoptions_top_absolute = options_max_height - options_option_height / 2,
								simpleoptions_top = - simpleoptions_top_absolute,
								simpleoptions_padding_top = simpleoptions_top_absolute,
								simpleoptions_padding_bottom = simpleoptions_top_absolute;
							if(optionpos.top < simpleoptions_padding_top){
								simpleoptions_top += simpleoptions_padding_top - optionpos.top;
								simpleoptions_padding_top = optionpos.top;
							} else {
								optionpos.bot = simpleoptions_height - optionpos.top - options_option_height;
								if(optionpos.bot < simpleoptions_padding_top){
									simpleoptions_top = - simpleoptions_padding_top;
									simpleoptions_padding_top = optionpos.bot;
								}
							}
							var scrollable_optionpos_top = optionpos.top - simpleoptions_padding_top;
							if(scrollable_optionpos_top < 0) scrollable_optionpos_top = 0;
							simpleoptions_future_height = options_option_height + simpleoptions_padding_top + simpleoptions_padding_bottom;
							simpleoptions.css({
								top: simpleoptions_top +'px'
							});
							// if .options definitely needs a scrollbar
							if(simpleoptions_future_height < simpleoptions_height){
								scrollable = true;
								simpleoptions.css({
									height: simpleoptions_future_height +'px',
									'overflow-y': 'scroll'
								});
								setTimeout(function(){ // queue the scrolltop to buy some time for some browsers (IE) to render the above code
									simpleoptions.scrollTop(scrollable_optionpos_top);
								}, 0);
								simpleoptions.addClass("scrollable");
							}
						}
						// if .options needs a scrollbar
						if(!scrollable){
							simpleoptions.css({
								top: '-'+ optionpos.top +'px'
							});
							simpleoptions.removeClass("scrollable");
						}
					}
				};
				// add some behaviors to the simpleselect
				simpleselect
					.data("simpleselect", simpleselectdata)
					.bind({
						mousedown: function(e){
							$(this).data("simpleselect").can_be_closed = false;
						},
						click: function(e){
							e.stopPropagation();
							var simpleselectdata = $(this).data("simpleselect");
							// handle clicks on the whole select
							simpleselectdata.set_active();
							// handle the click on an option
							if($(e.target).is(".option")){
								simpleselectdata.choose_option($(e.target));
								simpleselectdata.set_inactive();
							}
						},
						mouseup: function(){
							$(this).data("simpleselect").can_be_closed = true;
						},
						mouseover: function(e){
							// handle the mouseover on an option
							if($(e.target).is(".option")){
								$(this).data("simpleselect").set_option_active($(e.target));
							}
						}
					});
				// simpleselectref data
				var simpleselectrefdata = {
					ref: t,
					simpleselect: simpleselect,
					get_index_selected: function(){
						var select_options = this.ref.find("option"),
							option_selected = select_options.filter(":selected");
						if(option_selected.length > 0){
							return select_options.index(option_selected.first());
						} else {
							return select_options.index(select_options.first());
						}
					},
					disable: function(){
						this.ref.prop("disabled", true);
						this.simpleselect.addClass("disabled");
					},
					enable: function(){
						this.ref.prop("disabled", false);
						this.simpleselect.removeClass("disabled");
					}
				};
				// add some behaviors to the ref simpleselect
				t
					.data("simpleselectref", simpleselectrefdata)
					.bind({
						keydown: function(e){
							var selectrefdata = $(this).data("simpleselectref"),
								simpleselectdata = selectrefdata.simpleselect.data("simpleselect");
							// key up || key down
							if(e.keyCode == 38 || e.keyCode == 40){
								e.preventDefault();
								var options = selectrefdata.simpleselect.find(".options .option"),
									current_option_index = options.index(simpleselectdata.get_option_active()),
									last_option_index = options.index(options.last()),
									following_option_index = false;
								if(e.keyCode == 38 && current_option_index > 0){
									following_option_index = current_option_index - 1;
								} else if(e.keyCode == 40 && current_option_index < last_option_index){
									following_option_index = current_option_index + 1;
								}
								if(following_option_index !== false){
									var following_option = options.eq(following_option_index),
										following_option_pos = following_option.position();
									simpleselectdata.set_option_active(following_option);
									simpleselectdata.choose_option(following_option);
									var simpleoptions = selectrefdata.simpleselect.children(".options");
									if(simpleoptions.is(".scrollable")){
										simpleoptions.scrollTop(following_option_pos.top + simpleoptions.scrollTop());
									}
								}
							// key enter || key tab
							} else if(e.keyCode == 13 || e.keyCode == 9){
								simpleselectdata.choose_option(simpleselectdata.get_option_active());
								if(e.keyCode == 13){
									e.preventDefault();
									simpleselectdata.set_inactive();
									$(this).trigger("pressedEnter.simpleselect");
								}
							}
						},
						focus: function(){
							$(this).data("simpleselectref").simpleselect.data("simpleselect").set_active();
						},
						blur: function(){
							var simpleselectdata = $(this).data("simpleselectref").simpleselect.data("simpleselect")
							if(simpleselectdata.can_be_closed){
								simpleselectdata.set_inactive();
							}
						}
					});
				// disable the simpleselect if the select is disabled
				if(simpleselectrefdata.ref.prop("disabled")){
					simpleselectrefdata.disable();
				}
				// container for options
				var simpleoptions = '<div class="options">';
				// add options to the container
				var add_option_to_simpleselect = function(option){
					simpleoptions += '<div class="option">'+ option.text() +'</div>';
				};
				// add optgroups to the container
				var simpleselect_children = t.children("optgroup, option");
				if(simpleselect_children.filter("optgroup").length){
					simpleselect.addClass("has-optgroup");
				}
				simpleselect_children.each(function(){
					var t = $(this);
					if(t.is("optgroup")){
						simpleoptions += '<div class="optgroup">';
						var label = t.attr("label");
						if(label){
							simpleoptions += '<div class="optgroup-label">'+ label +'</div>';
						}
						t.children("option").each(function(){
							add_option_to_simpleselect($(this));
						});
						simpleoptions += '</div>';
					} else {
						add_option_to_simpleselect(t);
					}
				});
				simpleoptions += '</div>';
				// append the container to the simpleselect
				simpleselect.append(simpleoptions);
				// fill the placeholder
				simpleplaceholder.text(simpleselect.data("simpleselect").get_option_to_activate().text());
				// add the simpleselect to the dom
				t.after(simpleselect);
				
				// hide the select
				var hidden_select_container = $('<div class="hidden_select_container"></div>');
				t.after(hidden_select_container).appendTo(hidden_select_container);
			});
			
		// additional plugin call (function call)
		} else {
			
			t.each(function(){
				var t = $(this);
				if(typeof(t.data('simpleselectref')[mixed]) == 'function'){
					t.data('simpleselectref')[mixed](Array.prototype.slice.call(arguments, 1));
				}
			});

		}
		
		return t;
	};
})(jQuery);