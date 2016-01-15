Number.prototype.toHex = function() {
  var _hex = this.toString(16);
  return _hex.length == 1 ? "0" + _hex : _hex
};

Array.prototype.toHex = function() {
  return this.slice(0,3).map(function(i){
    return i.toHex();
  }).join("");
};

var ImageFIle = React.createClass({
  render: function(){
    return (
      <label className="custom-upload" style={this.props.styles}><input type="file" onChange={this.props.onChange} />Upload</label>
    );
  }
});

var Palette = React.createClass({
  render: function() {
    var palette = this.props.palette.map(function(colorHex, i) {
      return (<span className="col-md-4" style={{ backgroundColor: colorHex }} key={colorHex + i.toString()}>{colorHex}</span>);
    });

    return (
      <div className="row lead">
        {palette}
      </div>
    );
  }
});

var MainColorLead = React.createClass({
  render: function() {
    return (
      <h1 className="cover-heading">
        Main: {this.props.colorHex}
      </h1>
    );
  }
});

var Canvas = React.createClass({
  componentDidMount: function() { 
    var initImg = new Image(), canvas = this;
    initImg.onload = function() {
      canvas.drawImage(this);
      delete(this);
    }
    initImg.src = "assets/images/WeBareBears.jpg";
  },
  componentDidUpdate: function() { this.drawImage(this.props.image) },

  drawImage: function(image){
    if(!this.props.imageData){return}

    var canvas = ReactDOM.findDOMNode(this.refs.canvas), context = canvas.getContext('2d');
    var ow = 670;
    if(image.width > ow){
      canvas.width = ow;
      canvas.height = image.height*(ow/image.width);
    }else{
      canvas.width = image.width;
      canvas.height = image.height;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  },

  render: function() {
    return (
      <canvas ref="canvas"></canvas>
    );
  }
});

var InnerCover = React.createClass({
  getInitialState: function () {
    return {
      imageData: "fake",
      mainColor: "#8f9a95",
      palette: ["#6b6f68", "#e1e6db", "#bddfe0", "#3a594f", "#634242", "#b0a195", "#91613e", "#7fa6ad", "#b8c6bb"]
    };
  },

  componentDidMount: function(){
    var component = this;
    component.props.image.onload = function(event){
      var _this = event.target;
      component.changeColors(_this);
    }
  },

  fileReader: function() {
    var component = this;
    if(!component.reader) {
      component.reader = new FileReader();
      component.reader.onload = function(){
        component.props.image.src = this.result;
        component.setState({
          imageData: this.result
        });
      }
    }
    
    return component.reader;
  },

  handleFileChanged: function(event){
    var trigger = event.target;
    if(trigger.files.length){
      this.fileReader().readAsDataURL(trigger.files[0]);
    }
  },

  changeColors: function (image){
    var mainColor = "#" + this.props.colorThief.getColor(image).toHex();
    var palette = this.props.colorThief.getPalette(image).map(function(rgb){return "#" + rgb.toHex();});

    this.setState({
      mainColor: mainColor,
      palette: palette,
    });
  },

  render: function() {
    var imgData = this.state.imageData;
    var mainColor = this.state.mainColor;
    var palette = this.state.palette;
    var btnColor = palette[3];
    return (
      <div className="site-wrapper" style={{ backgroundColor: mainColor }}>
        <div className="site-wrapper-inner">
          <div className="cover-container">

            <div className="masthead clearfix">
              <div className="inner">
                <h3 className="masthead-brand">Palette</h3>
              </div>
            </div>

            <div className="inner cover">
              <Canvas image={this.props.image} imageData={imgData} />
                
              <MainColorLead colorHex={mainColor}/>
              <Palette palette={palette} />

              <p className="lead">
                Generate your palette from an image/logo
              </p>

              <ImageFIle styles={{backgroundColor: btnColor}} onChange={this.handleFileChanged}/>
            </div>

            <div className="mastfoot">
              <div className="inner">
                <p><a href="https://github.com/pokka/palette">Github</a></p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<InnerCover colorThief={new ColorThief()} image={new Image()} />, document.getElementById("container"));
