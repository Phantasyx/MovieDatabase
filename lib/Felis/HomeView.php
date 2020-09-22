<?php
/**
 * Created by PhpStorm.
 * User: X
 * Date: 3/29/2017
 * Time: 1:35 AM
 */

namespace Felis;


class HomeView extends View
{
    /**
     * Constructor
     * Sets the page title and any other settings.
     */
    public function __construct() {
        $this->setTitle("Felis Investigations");
        $this->addLink("login.php", "Log in");

    }
    /**
     * Add content to the header
     * @return string Any additional comment to put in the header
     */
    protected function headerAdditional() {
        return <<<HTML
<p>Welcome to Felis Investigations!</p>
<p>Domestic, divorce, and carousing investigations conducted without publicity. People and cats shadowed
	and investigated by expert inspectors. Katnapped kittons located. Missing cats and witnesses located.
	Accidents, furniture damage, losses by theft, blackmail, and murder investigations.</p>
<p><a href="">Learn more</a></p>
HTML;
    }


    public function testimonials(){
        $html = "<h2>TESTIMONIALS</h2>";
        $html .= $this->left . "</div>" . $this->right . "</div>";
        return $html;
    }


    public function addTestimonial($testimonial, $source){
        $html = <<<HTML
        <blockquote>
        <p>$testimonial</p>
        <cite>$source</cite>
</blockquote>
HTML;
        if($this->isLeft){
            $this->left .= $html;
            $this->isLeft = false;
        }
        else{
            $this->right .= $html;
            $this->isLeft = true;
        }
    }
    private $left = '<div class="left">';
    private $right = '<div class="right">';
    private $isLeft = true;






}