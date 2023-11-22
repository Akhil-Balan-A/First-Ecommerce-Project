notes
//express validator - need to check how to use

<% if (typeof message !== "undefined") { %>
    <div class="alert alert-success" role="alert">
        <%= message %>
    </div>
<% } %>


<!--flash message-->
<%- messages('messages', locals) %>

<% Object.keys(messages).forEach(function (type) { %>
    <div class="alert alert-<%=type%>">

      <% messages[type].forEach(function (message) { %>
      <%= message %>
      <% }) %>
    </div>
    <% }) %>







    createCategory: async (req, res) => {
        const { name, description } = req.body;
        const slug = name.replace(/\s+/g, '-').toLowerCase();
        req.checkBody('name','name must have a value.').notEmpty();
        var errors =req.validationErrors();
        if(errors){
          res.render('addCategory',{errors:errors,name: name})
        }else{
          Category.findOne({slug:slug},function(err,category){
            if(category){
              req.flash('danger','Category name exists, choose another one.');
              res.render('addCategory',{name:name})
            }else{
              const category = new Category({
                name: name,
                slug: slug
              });
              category.save(function(err){
                if(err)
                return console.log(err);
              req.flash('success','category added');
              res.redirect('/admin/categories')
              })
            }
          })
        }
        try {
          const newCategory = new Category({ name, description,slug});
          const savedCategory = await newCategory.save();
          res.render('addCategory',{message:"Category added successfully"})
        } catch (error) {
          console.error(error.message);
          res.status(500).send('Internal Server Error');
        }
      },