Declare_Any_Class("Picker",
{
	'construct'		: function( canvas )
	{
		this.define_data_members( {
			plist: [],
			canvas: canvas,
			pickTexture: null,
			framebuffer: null,
			renderbuffer: null,

			processHitsCallback: null,
			addHitCallback: null,
			removeHitCallback: null,
			hitPropertyCallback: null,
			moveCallback: null
		} ); 

		this.configure();
	},
	'configure'		: function()
	{
		var width = this.canvas.width;
		var height = this.canvas.height;

		// 1. Init Picking Texture
		this.pickTexture = gl.createTexture();
		gl.bindTexture( gl.TEXTURE_2D, this.pickTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );

		// 2. Init Render Buffer
		this.renderbuffer = gl.createRenderBuffer();
		gl.bindRenderbuffer( gl.RENDERBUFFER, this.renderbuffer );
		gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height );

		// 3. Init Frame Buffer
		this.framebuffer = gl.createFrameBuffer();
		gl.bindFramebuffer( gl.FRAMEBUFFER, this.framebuffer );
		gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.pickTexture, 0 );
		gl.framebufferRenderbuffer( gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT1, gl.RENDERBUFFER, this.renderbuffer );

		// 4. Clean up
		gl.bindTexture( gl.TEXTURE_2D, null );
		gl.bindRenderbuffer( gl.RENDERBUFFER, null );
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );
	},
	'update'		:function()
	{
		var width = this.canvas.width;
		var height = this.canvas.height;

		gl.bindTexture( gl.TEXTURE_2D, this.pickTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );

		// Init Render Buffer
		gl.bindRenderbuffer( gl.RENDERBUFFER, this.renderbuffer );
		gl.renderbufferStorage( gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height );
	},
	'_compare'		: function( readout, color )
	{
		return (Math.abs(Math.round(color[0]*255) - readout[0]) <= 1 &&
			Math.abs(Math.round(color[1]*255) - readout[1]) <= 1 && 
			Math.abs(Math.round(color[2]*255) - readout[2]) <= 1);
	},
	'find'			: function( coords )
	{
		// read one pixel
		var readout = new Uint8Array( 1 * 1 * 4 );
		gl.bindFramebuffer( gl.FRAMEBUFFER, this.framebuffer );
		gl.readPixels( coords.x, coords.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, readout );
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );

		var found = false;

		if ( this.hitPropertyCallback == undefined ) { alert( 'The picker needs an object property to perform the comparison' ); return; }

		// TODO
		// for ( var i = 0)
	},
	'stop'			: function()
	{
		if ( this.processHitsCallback != null && this.plist.length > 0 ) {
			this.processHitsCallback( this.plist );
		}
		this.plist = [];
	}
});