yc.outer.VirusCluster = yc.outer.LifeEntity.extend({
    
    size: 6 
    
    , speed: 0.5
    , _char: '$'
    , lv: 1
        
    , init: function(){
    	
        var idx = Math.round(Math.random()*(yc.outer.VirusCluster.charset.length-1)) ;
        this._char = yc.outer.VirusCluster.charset.charAt(idx) ;
        
        this.randomTurn() ;
        
        // 根据离Boss的距离确定病毒群的等级
        var compass = yc.outer.BossCompass.ins() ;
        if(compass.nearestBoss)
        {
        	this.lv = compass.nearestBoss.lv - Math.round(compass.nearestDis/200) - 10 ;
        	if(this.lv<1)
        	{
        		this.lv = 1 ;
        	}
        }
    }
    
    , transform: yc.outer.Camera.transformSprite
    , draw: function(ctx){
        
        ctx.fillStyle = 'red' ;
        ctx.font="normal 4px san-serif";
        ctx.fillText(this._char,0,0);
        
        ctx.fillText('Lv '+this.lv,5,-8);
    }
    
    , vigilanceRange: function(){
        return 200 ;
    }
    
    , _visit: cc.Sprite.prototype.visit
    , visit: function(c){
        
        // 判断碰撞
        var cell = yc.outer.Cell.ins() ;
        var dis = Math.sqrt(Math.pow(this.x-cell.x,2) + Math.pow(this.y-cell.y,2)) ;
        if( dis<this.size+cell.radius )
        {
            this._parent.deleteRole(this) ;
            
            // 计算病毒群到细胞圆心的绝对弧度
            var radian = yc.util.radianBetweenPoints(cell.x,cell.y,this.x,this.y) ;
            
            // 计算病毒群相对细胞的弧度
            radian = radian - cell.angle ;
            if(radian<0)
            {
                radian = 2*Math.PI + radian ;
            }

            // 
            log(radian) ;
            yc.inner.InnerLayer.ins().touchVirusCluster(radian) ;
            
            return ;
        }
        
        // 警示范围
        if( this.vigilanceRange() > yc.util.pointsDis(cell.x,cell.y,this.x,this.y) )
        {
            // 调整角度
            var targetAngle = yc.util.radianBetweenPoints(this.x,this.y,cell.x,cell.y) ;
            var turnAngle = this.angle - targetAngle ;
            if(turnAngle<0)
            {
                this.incAngle( turnAngle>-Math.PI? 1: -1 ) ;
            }
            else
            {
                this.incAngle( turnAngle<Math.PI? -1: 1 ) ;
            }
            
            // 切换到追击速度
            this.speed = 4 ;
            
            this.moving() ;
        }
        
        // 漫步
        else
        {
            this.mosey() ;
        }
        
        this._visit(c) ;
    }
      
}) ;

yc.outer.VirusCluster.className = 'yc.outer.VirusCluster' ;

yc.outer.VirusCluster.charset = '#&~ξζ§$ぷ￡' ;
yc.outer.VirusCluster.className = 'yc.outer.VirusCluster' ;